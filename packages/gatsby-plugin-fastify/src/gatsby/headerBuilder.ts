import compose from "just-compose";
import merge from "just-merge";
import typeOf from "just-typeof";

import { SECURITY_HEADERS, CACHING_HEADERS, IMMUTABLE_CACHING_HEADER } from "../utils/constants";
import type { PluginData } from "../utils/plugin-data";
import type { GatsbyNodeServerConfig } from "../utils/config";

function deepMerge(...headers) {
  return headers.reduce((acc, header: { [key: string]: object }) => {
    for (let [key, value] of Object.entries(header)) {
      console.log(typeOf(value));
      if (acc.hasOwnProperty(key) && typeOf(value) === `object`) {
        //merge needs empty object to prevent overwriting of references use across multiple routes
        acc[key] = merge({}, acc[key], value);
      } else {
        acc[key] = value;
      }
    }
    return acc;
  }, {});
}

// program methods
const applySecurityHeaders =
  ({ mergeSecurityHeaders }: GatsbyNodeServerConfig) =>
  (headers) => {
    if (!mergeSecurityHeaders) {
      return headers;
    }

    return deepMerge(SECURITY_HEADERS, headers);
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
        cachingHeaders[`/` + file] = IMMUTABLE_CACHING_HEADER;
      }
    });

    return deepMerge(cachingHeaders, CACHING_HEADERS, headers);
  };

export function buildHeadersProgram(pluginData, pluginOptions) {
  return compose(
    applySecurityHeaders(pluginOptions),
    applyCachingHeaders(pluginData, pluginOptions),
  )(pluginOptions.headers);
}
