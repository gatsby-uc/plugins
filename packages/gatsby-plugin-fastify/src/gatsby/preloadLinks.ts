//Most of this file was coppied from or had it's orgins in `gatsby-plugin-gatsby-cloud`

import { existsSync } from "fs-extra";
import { parse, posix } from "path";
import kebabHash from "kebab-hash";
import { fixedPagePath } from "gatsby-core-utils";

import type { IGatsbyState } from "gatsby/dist/redux/types";
import type { GatsbyServerFeatureOptions } from "../plugins/gatsby";
import type { AssetManifest, PluginData } from "../utils/plugin-data";
import { COMMON_BUNDLES, PAGE_DATA_DIR } from "../utils/constants";

export async function getPreloadLinks(
  pluginData: PluginData,
  pluginOptions: GatsbyServerFeatureOptions,
) {
  const { preloadLinkHeaders } = pluginOptions;
  if (!preloadLinkHeaders) {
    return {};
  }

  const { pages, manifest, pathPrefix, publicFolder } = pluginData;

  return preloadHeadersByPage({
    pages,
    manifest,
    pathPrefix,
    publicFolder,
  });
}

function preloadHeadersByPage({
  pages,
  manifest,
  pathPrefix,
  publicFolder,
}: {
  pages: IGatsbyState["pages"];
  manifest: { [key: string]: string };
  pathPrefix: string;
  publicFolder: (...paths: string[]) => string;
}) {
  const linksByPage = {};

  const appDataPath = publicFolder(PAGE_DATA_DIR, `app-data.json`);
  const hasAppData = existsSync(appDataPath);

  pages.forEach((page) => {
    const scripts = COMMON_BUNDLES.flatMap((file) => getScriptPath(file, manifest));
    scripts.push(...getScriptPath(pathChunkName(page.path), manifest));
    scripts.push(...getScriptPath(page.componentChunkName, manifest));

    const json: string[] = [];

    if (hasAppData) {
      json.push(posix.join(PAGE_DATA_DIR, `app-data.json`));
    }

    // page-data gets inline for SSR, so we won't be doing page-data request
    // and we shouldn't add preload link header for it.
    if (page.mode !== `SSR`) {
      json.push(getPageDataPath(page.path));
    }

    const filesByResourceType = {
      script: scripts.filter(Boolean),
      fetch: json,
    };

    const pathKey = headersPath(pathPrefix, page.path);
    linksByPage[pathKey] = linkHeaders(filesByResourceType, pathPrefix);
  });

  return linksByPage;
}

function getScriptPath(file: string, manifest: AssetManifest) {
  const chunk = manifest[file];

  if (!chunk) {
    return [];
  }

  // convert to array if it's not already
  const chunks: string[] = Array.isArray(chunk) ? chunk : [chunk];

  return chunks.filter((script) => {
    const parsed = parse(script);
    // handle only .js, .css content is inlined already
    // and doesn't need to be pushed
    return parsed.ext === `.js`;
  });
}

function pathChunkName(path: string) {
  const name = path === `/` ? `index` : kebabHash(path);
  return `path---${name}`;
}

function getPageDataPath(path: string) {
  return posix.join(`page-data`, fixedPagePath(path), `page-data.json`);
}

function headersPath(pathPrefix: string, path: string) {
  return `${pathPrefix}${path}`;
}

function linkHeaders(files: { fetch: string[]; script: string[] }, pathPrefix: string) {
  const linkHeaders: string[] = [];
  for (const resourceType in files) {
    files[resourceType].forEach((file) => {
      linkHeaders.push(linkTemplate(`${pathPrefix}/${file}`, resourceType));
    });
  }

  return linkHeaders;
}

function linkTemplate(assetPath: string, type = `script`) {
  return `Link: <${assetPath}>; rel=preload; as=${type}${
    type === `fetch` ? `; crossorigin` : ``
  }; nopush`;
}
