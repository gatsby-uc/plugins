import { writeJSON } from "fs-extra";
import WebpackAssetsManifest from "webpack-assets-manifest";

import type { GatsbyNodeServerConfig } from "./utils/config";
import type { GatsbyNode } from "gatsby";

import { CONFIG_FILE_NAME, BUILD_HTML_STAGE, BUILD_CSS_STAGE } from "./utils/constants";
import { makePluginData } from "./utils/plugin-data";
import { getFunctionManifest } from "./gatsby/functionsManifest";
import { getClientSideRoutes } from "./gatsby/clientSideRoutes";
import { buildHeadersProgram } from "./gatsby/headerBuilder";
import { getServerSideRoutes } from "./gatsby/serverRoutes";

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
  pluginOptions: GatsbyNodeServerConfig,
) => {
  const { redirects } = store.getState();

  try {
    const pluginData = await makePluginData(store, assetsManifest, pathPrefix);

    const functions = await getFunctionManifest(pluginData);
    const clientSideRoutes = await getClientSideRoutes(pluginData);
    const serverSideRoutes = await getServerSideRoutes(pluginData);
    const headers = await buildHeadersProgram(pluginData, pluginOptions);

    // @ts-ignore
    delete pluginOptions.plugins;

    const config: GatsbyNodeServerConfig = {
      ...pluginOptions,
      clientSideRoutes,
      serverSideRoutes,
      redirects,
      prefix: pathPrefix,
      functions,
      headers,
    };

    await writeJSON(pluginData.configFolder(CONFIG_FILE_NAME), config, { spaces: 2 });
  } catch (e) {
    reporter.error("Error building config for Fastify Server", e, "gatsby-plugin-fastify");
  }
};

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }) => {
  const MATCH_ALL_KEYS = /^/;
  const headersSchema = Joi.object()
    .pattern(
      MATCH_ALL_KEYS,
      Joi.array().items(Joi.string().pattern(/^[a-zA-Z\-]+\:\s*\S+\s*$/, { name: "header" })),
    )
    .default({})
    .description(`Add more headers to specific pages`);
  return Joi.object({
    compression: Joi.boolean()
      .default(true)
      .description("Enable server side compression of text assets."),
    headers: headersSchema,
    mergeSecurityHeaders: Joi.boolean().default(true),
    mergeCacheHeaders: Joi.boolean().default(true),
  });
};
