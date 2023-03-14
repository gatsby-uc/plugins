import compose from "just-compose";
import merge from "just-merge";
import typeOf from "just-typeof";

import { SECURITY_HEADERS, CACHING_HEADERS, IMMUTABLE_CACHING_HEADER } from "../utils/constants";
import type { PluginData } from "../utils/plugin-data";
import type { GatsbyFastifyPluginOptions } from "../utils/config";
import { Headers } from "../utils/headers";

function deepMerge(...headers: Headers[]) {
  const merged = {};
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

// program methods
const applySecurityHeaders =
  ({
    features: {
      headers: { useDefaultSecurity },
    },
  }: GatsbyFastifyPluginOptions) =>
  (headers: Headers) => {
    if (!useDefaultSecurity) {
      return headers;
    }

    return deepMerge(SECURITY_HEADERS, headers);
  };

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

export function buildHeadersProgram(
  pluginData: PluginData,
  pluginOptions: GatsbyFastifyPluginOptions
) {
  return compose(
    applySecurityHeaders(pluginOptions),
    applyCachingHeaders(pluginData, pluginOptions)
  )(pluginOptions.features.headers.customHeaders);
}
