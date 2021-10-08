import { existsSync, mkdir, writeJSON } from "fs-extra";

import WebpackAssetsManifest from "webpack-assets-manifest";
import { GatsbyNode } from "gatsby";

import type { GatsbyServerFeatureOptions } from "./plugins/gatsby";
import type { GatsbyNodeServerConfig } from "./utils/config";
import { makePluginData } from "./utils/plugin-data";
import {
  BUILD_CSS_STAGE,
  BUILD_HTML_STAGE,
  CONFIG_FILE_NAME,
  PATH_TO_CACHE,
} from "./utils/constants";
import { getPreloadLinks } from "./gatsby/preloadLinks";
import getFunctionManifest from "./gatsby/functionsManifest";
import { getClientSideRoutes } from "./gatsby/clientSideRoutes";

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
  pluginOptions: GatsbyServerFeatureOptions,
) => {
  const pluginData = await makePluginData(store, assetsManifest, pathPrefix);

  // Get all data for server
  const { redirects } = store.getState();
  const preloadLinkList = await getPreloadLinks(pluginData, pluginOptions);
  const functions = await getFunctionManifest(pluginData);
  const clientSideRoutes = await getClientSideRoutes(pluginData);

  // @ts-ignore
  delete pluginOptions.plugins;

  const config: GatsbyNodeServerConfig = {
    ...pluginOptions,
    clientSideRoutes,
    redirects,
    prefix: pathPrefix,
    preloadLinks: preloadLinkList,
    functions,
  };

  // create cache if it doesn't exist for some reason.
  if (!existsSync(PATH_TO_CACHE)) {
    await mkdir(PATH_TO_CACHE);
  }

  try {
    await writeJSON(pluginData.configFolder(CONFIG_FILE_NAME), config, { spaces: 2 });
  } catch (e) {
    reporter.error("Error writing config file.", e, "gatsby-plugin-fastify");
  }
};

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }) => {
  return Joi.object({
    compression: Joi.boolean().default(true),
    earlyHints: Joi.boolean().default(true),
  });
};
