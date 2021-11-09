import { writeJSON } from "fs-extra";
import WebpackAssetsManifest from "webpack-assets-manifest";

import { hasFeature } from "gatsby-plugin-utils";

import type { GatsbyFastifyPluginOptions, GatsbyNodeServerConfig } from "./utils/config";
import type { GatsbyNode } from "gatsby";

import { makePluginData } from "./utils/plugin-data";
import { getFunctionManifest } from "./gatsby/funcitons-manifest";
import { getClientSideRoutes } from "./gatsby/client-side-route";
import { getServerSideRoutes } from "./gatsby/server-routes";
import { getProxiesAndRedirects } from "./gatsby/proxies-and-redirects";
import {
  CONFIG_FILE_NAME,
  BUILD_HTML_STAGE,
  BUILD_CSS_STAGE,
} from "./utils/constants";
import { buildHeadersProgram } from "./gatsby/headerBuilder";

const assetsManifest: WebpackAssetsManifest.Assets = {};

// Inject a webpack plugin to get the file manifests so we can translate all link headers
export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({ actions, stage }) => {
  //@ts-expect-error
  if (stage !== BUILD_HTML_STAGE && stage !== BUILD_CSS_STAGE) {
    return;
  }

  actions.setWebpackConfig({
    plugins: [
      new WebpackAssetsManifest({
        assets: assetsManifest, // mutates object with entries
        merge: true,
      }),
    ],
  });
};

export const onPostBuild: GatsbyNode["onPostBuild"] = async (
  { store, pathPrefix, reporter },
  pluginOptions: GatsbyFastifyPluginOptions
) => {
  try {
    const { proxies, redirects } = getProxiesAndRedirects(store);
    const pluginData = await makePluginData(store, pathPrefix);

    const functions = await getFunctionManifest(pluginData);
    const clientSideRoutes = await getClientSideRoutes(pluginData);
    const serverSideRoutes = await getServerSideRoutes(pluginData);
    const headers = await buildHeadersProgram(pluginData, pluginOptions);

    // @ts-expect-error This can't exist and making TS happy another way got complicated
    delete pluginOptions.plugins;

    const config: GatsbyNodeServerConfig = {
      ...pluginOptions,
      clientSideRoutes,
      serverSideRoutes,
      redirects,
      proxies,
      prefix: pathPrefix,
      functions,
      headers,
  };

    await writeJSON(pluginData.configFolder(CONFIG_FILE_NAME), config, { spaces: 2 });
  } catch (error) {
    if (error instanceof Error) {
      reporter.error("Error building config for Fastify Server", error, "gatsby-plugin-fastify");
    }
  }
};

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }) => {
  const MATCH_ALL_KEYS = /^/;
  const headersSchema = Joi.object()
    .pattern(MATCH_ALL_KEYS, Joi.object().pattern(MATCH_ALL_KEYS, Joi.string().required()))
    .default({})
    .description(`Add headers to specific pages`);
  return Joi.object({
    features: Joi.object({
      reverseProxy: Joi.alternatives().try(Joi.boolean(), Joi.object()).default(true),
      redirects: Joi.boolean().default(true),
      imageCdn: Joi.boolean()
        .default(hasFeature("image-cdn"))
        .custom((value, helpers) => {
          if (value && !hasFeature("image-cdn")) {
            return helpers.error(
              "The Image CDN is not supported by your Gatsby version. Please upgrade to Gatsby v4.10.0 or higher to use it."
            );
          }

          return value;
        }),
    }).default(),
    headers: headersSchema,
    mergeSecurityHeaders: Joi.boolean().default(true),
    mergeCacheHeaders: Joi.boolean().default(true),
  });
};
