import { existsSync, mkdir, writeJSON } from "fs-extra";

import type { GatsbyServerFeatureOptions } from "./plugins/gatsby";
import type { GatsbyNodeServerConfig } from "./utils/config";
import type { GatsbyNode } from "gatsby";

import { makePluginData } from "./utils/plugin-data";
import { getFunctionManifest } from "./gatsby/functionsManifest";
import { CONFIG_FILE_NAME, PATH_TO_CACHE } from "./utils/constants";
import { getClientSideRoutes } from "./gatsby/clientSideRoutes";

export const onPostBuild: GatsbyNode["onPostBuild"] = async (
  { store, pathPrefix, reporter },
  pluginOptions: GatsbyServerFeatureOptions,
) => {
  const { redirects } = store.getState();

  const pluginData = await makePluginData(store, pathPrefix);

  const functions = await getFunctionManifest(pluginData);
  const clientSideRoutes = await getClientSideRoutes(pluginData);

  // @ts-ignore
  delete pluginOptions.plugins;

  const config: GatsbyNodeServerConfig = {
    ...pluginOptions,
    clientSideRoutes,
    redirects,
    prefix: pathPrefix,
    functions,
  };

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
  });
};
