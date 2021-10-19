// import { getConfig } from "../utils/config";

// import type { GatsbyServerFeatureOptions } from "../plugins/gatsby";
// export function buildPathHeaders(path: string): string[] {
//   const {
//     server: { headers },
//   } = getConfig();

//   const routeHeaders: string[] = [];

//   for(const header of headers) {}

//   return routeHeaders
// }

// function getHeaderParts(header: string): string[] {
//   const parts = /^([^\s:]+):\s*([^\s:]+)\s*$/.exec(header);
// }

// const {
//   server: { mergeSecurityHeaders, mergeCacheHeaders, headers },
// } = getConfig();

// function applySecurityHeaders(headers: string[]): string[] {
//   return headers.concat(securityHeaders);
// }

// function applyCacheHeaders({ mergeCacheHeaders }: GatsbyServerFeatureOptions) {

//   return (headers) => {
//     if (!mergeCacheHeaders) {
//       return headers;
//     }
//     if (
//       isMatch(path, ["**/public/*.@(js|css)", "**/public/static/**"]) &&
//       isMatch(path, "!**/sw.js")
//       ) {
//         reply.setHeader(...IMMUTABLE_CACHING_HEADER);
//       } else {
//         reply.setHeader(...NEVER_CACHE_HEADER);
//       }
//     }
// }

// // Pulled from gatsby cloud plugin
// function transformLink(manifest, publicFolder, pathPrefix) {
//   return header =>
//     header.replace(LINK_REGEX, (__, prefix, file, suffix) => {
//       const hashed = manifest[file]
//       if (hashed) {
//         return `${prefix}${pathPrefix}${hashed}${suffix}`
//       } else if (existsSync(publicFolder(file))) {
//         return `${prefix}${pathPrefix}${file}${suffix}`
//       } else {
//         throw new Error(
//           `Could not find the file specified in the Link header \`${header}\`.` +
//             `The gatsby-plugin-gatsby-cloud is looking for a matching file (with or without a ` +
//             `webpack hash). Check the public folder and your gatsby-config.js to ensure you are ` +
//             `pointing to a public file.`
//         )
//       }
//     })
// }

import _ from "lodash";
import { SECURITY_HEADERS, CACHING_HEADERS, IMMUTABLE_CACHING_HEADER } from "../utils/constants";
import type { PluginData } from "../utils/plugin-data";
import type { GatsbyNodeServerConfig } from "../utils/config";

function getHeaderName(header) {
  const matches = header.match(/^([^:]+):/);
  return matches && matches[1];
}

function defaultMerge(...headers) {
  function unionMerge(objValue, srcValue) {
    if (_.isArray(objValue)) {
      return _.union(objValue, srcValue);
    } else {
      return undefined; // opt into default merge behavior
    }
  }

  return _.mergeWith({}, ...headers, unionMerge);
}

function headersMerge(userHeaders, defaultHeaders) {
  const merged = {};
  Object.keys(defaultHeaders).forEach((path) => {
    if (!userHeaders[path]) {
      merged[path] = defaultHeaders[path];
      return;
    }
    const headersMap = {};
    defaultHeaders[path].forEach((header) => {
      headersMap[getHeaderName(header)] = header;
    });
    userHeaders[path].forEach((header) => {
      headersMap[getHeaderName(header)] = header; // override if exists
    });
    merged[path] = Object.values(headersMap);
  });
  Object.keys(userHeaders).forEach((path) => {
    if (!merged[path]) {
      merged[path] = userHeaders[path];
    }
  });
  return merged;
}

// program methods
const applySecurityHeaders =
  ({ mergeSecurityHeaders }: GatsbyNodeServerConfig) =>
  (headers) => {
    if (!mergeSecurityHeaders) {
      return headers;
    }

    return headersMerge(headers, SECURITY_HEADERS);
  };

const applyCachingHeaders =
  (pluginData: PluginData, { mergeCacheHeaders }: GatsbyNodeServerConfig) =>
  (headers) => {
    if (!mergeCacheHeaders) {
      return headers;
    }

    let chunks: string[] = [];
    // Gatsby v3.5 added componentChunkName to store().components
    // So we prefer to pull chunk names off that as it gets very expensive to loop
    // over large numbers of pages.
    const isComponentChunkSet = !!pluginData.components.entries()?.next()?.value[1]
      ?.componentChunkName;
    if (isComponentChunkSet) {
      chunks = [...pluginData.components.values()].map((c) => c.componentChunkName);
    } else {
      chunks = Array.from(pluginData.pages.values()).map((page) => page.componentChunkName);
    }

    chunks.push(`polyfill`, `app`);

    const files = chunks.flatMap((chunk) => pluginData.manifest[chunk]);

    const cachingHeaders = {};

    files.forEach((file) => {
      if (typeof file === `string`) {
        cachingHeaders[`/` + file] = [IMMUTABLE_CACHING_HEADER];
      }
    });

    return defaultMerge(headers, cachingHeaders, CACHING_HEADERS);
  };

export function buildHeadersProgram(pluginData, pluginOptions) {
  return _.flow(
    applySecurityHeaders(pluginOptions),
    applyCachingHeaders(pluginData, pluginOptions),
  )(pluginOptions.headers);
}
