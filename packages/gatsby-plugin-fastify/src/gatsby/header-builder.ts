import compose from "just-compose";
import merge from "just-merge";
import typeOf from "just-typeof";
import fs from "node:fs";
import path, { posix } from "node:path";
import { isMatch } from "picomatch";

import { Headers } from "../utils/headers";
import {
  CACHING_HEADERS,
  IMMUTABLE_CACHING_HEADER,
  NEVER_CACHE_HEADER,
  FUNCTIONS_PREFIX,
} from "../utils/constants";

import type { PluginData } from "../utils/plugin-data";
import type { GatsbyFastifyPluginOptions } from "../utils/config";

export type Page = {
  path: string;
  mode: "SSG" | "DSG" | "SSR" | "CSR" | "REDIRECT" | "PROXY" | "FUNCTION" | "404" | "500";
};

// recursive loop through public folder to get all actual static files and directories
// not just "gatsby pages" so we can add their corresponding header entries to config
async function getStaticFiles(folder: string, publicFolder: string, pages: Array<Page> = []) {
  try {
    const files = await fs.promises.readdir(folder);
    for (const file of files) {
      const fullPath = path.join(folder, file);
      // convert to posix path without publicFolder
      const serverPath = fullPath.replace(publicFolder, "").split(path.sep).join(path.posix.sep);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isFile()) {
        pages.push({
          path: serverPath,
          mode: "SSG",
        });
      } else if (stat.isDirectory()) {
        // don't push imageCDN directories as gatsby doesn't serve them
        if (!serverPath.includes("_gatsby/image")) {
          pages.push(
            {
              path: serverPath,
              mode: "SSG",
            },
            {
              path: serverPath + "/",
              mode: "SSG",
            }
          );
        }
        await getStaticFiles(fullPath, publicFolder, pages);
      }
    }
  } catch (error) {
    console.log("Unable to scan directory: " + error);
  } finally {
    return pages;
  }
}

function deepMerge(...headers: Headers[]) {
  const merged: Headers = {};
  for (const header of headers) {
    for (let [key, value] of Object.entries(header)) {
      merged[key] =
        merged.hasOwnProperty(key) && typeOf(value) === `object`
          ? merge({}, merged[key], value)
          : value;
    }
  }
  return merged;
}

const applyCachingHeaders =
  (
    pluginData: PluginData,
    {
      features: {
        headers: { useDefaultCaching },
      },
    }: GatsbyFastifyPluginOptions
  ) =>
  (headers: Headers) => {
    if (!useDefaultCaching) {
      return headers;
    }

    let chunks: string[] = [];
    // Gatsby v3.5 added componentChunkName to store().components
    // So we prefer to pull chunk names off that as it gets very expensive to loop
    // over large numbers of pages.
    const isComponentChunkSet = !!pluginData.components.entries()?.next()?.value[1]
      ?.componentChunkName;
    chunks = isComponentChunkSet
      ? [...pluginData.components.values()].map((c) => c.componentChunkName)
      : [...pluginData.pages.values()].map((page) => page.componentChunkName);

    chunks.push(`polyfill`, `app`);

    const files = chunks.flatMap((chunk) => pluginData.manifest[chunk]);

    const cachingHeaders: Headers = {};

    for (const file of files) {
      if (typeof file === `string`) {
        cachingHeaders[`/` + file] = IMMUTABLE_CACHING_HEADER;
      }
    }
    return deepMerge(cachingHeaders, CACHING_HEADERS, headers);
  };

const createUrlsToHeadersMap =
  ({ publicFolder }: PluginData, pages: Array<Page>) =>
  async (headers: Headers) => {
    const pageHeaders: Headers = {};
    const publicPages: Array<Page> = [];
    const serverPageDataPages: Array<Page> = [];
    const folder = publicFolder();

    // add SSR/DSG JSON page-data to pages
    for (const page of pages) {
      if (page.mode === "DSG" || page.mode === "SSR") {
        serverPageDataPages.push({
          path: posix.join("/page-data", page.path.replace(/^\/+|\/+$/g, ""), "page-data.json"), // trim leading/trailing slashes
          mode: page.mode,
        });
      }
    }

    // get all directories/files from public folder as they won't
    // all be listed in the pages from the manifest/chunks/etc
    await getStaticFiles(folder, folder, publicPages);
    const allPages = [...pages, ...publicPages, ...serverPageDataPages];

    // push URLs and their headers to pageHeaders
    for (const page of allPages) {
      const { path, mode } = page;
      // loop header patterns
      for (const [pattern, headerObject] of Object.entries(headers)) {
        // add standard pageHeaders for all modes
        // chunked files come in to `headers` with IMMUTABLE_CACHING_HEADER
        // which will overwrite the NEVER_CACHE_HEADER below
        if (isMatch(path, pattern)) {
          pageHeaders[path] = {
            ...NEVER_CACHE_HEADER,
            ...headerObject,
            ...pageHeaders[path],
          };
        }

        // add non trailing slash pageHeaders for DSG/SSR pages
        if ((mode === "DSG" || mode === "SSR") && isMatch(path, pattern)) {
          // add pageHeaders for DSG pages without trailing slash
          const pathWithoutTrailingSlash = path.replace(/\/$/, ``);
          pageHeaders[pathWithoutTrailingSlash] = {
            ...NEVER_CACHE_HEADER,
            ...headerObject,
            ...pageHeaders[pathWithoutTrailingSlash],
          };
        }

        // add REDIRECT specific pageHeaders
        if (mode === "REDIRECT" && isMatch(path, pattern)) {
          pageHeaders[path] = {
            ...pageHeaders[path],
            "cache-control": "undefined",
          };
        }

        // add PROXY specific pageHeaders
        if (mode === "PROXY" && isMatch(path, pattern)) {
          pageHeaders[path] = {
            ...pageHeaders[path],
            "cache-control": "undefined",
          };
        }

        // add FUNCTION specific pageHeaders
        if (mode === "FUNCTION") {
          const functionPath = `${FUNCTIONS_PREFIX}${path}`;
          if (isMatch(functionPath, pattern)) {
            pageHeaders[functionPath] = {
              ...NEVER_CACHE_HEADER,
              ...headerObject,
              ...pageHeaders[functionPath],
            };
          }
        }
      }
    }
    return deepMerge(headers, pageHeaders);
  };

export function buildHeadersProgram(
  pluginData: PluginData,
  pluginOptions: GatsbyFastifyPluginOptions,
  pages: Array<Page>
) {
  return compose(
    applyCachingHeaders(pluginData, pluginOptions),
    createUrlsToHeadersMap(pluginData, pages)
  )(pluginOptions.features.headers.customHeaders);
}
