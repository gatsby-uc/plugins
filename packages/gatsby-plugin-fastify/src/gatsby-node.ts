import { writeJSON } from "fs-extra";

import { hasFeature } from "gatsby-plugin-utils";

import type { GatsbyFastifyPluginOptions, GatsbyNodeServerConfig } from "./utils/config";
import type { GatsbyNode } from "gatsby";

import { makePluginData } from "./utils/plugin-data";
import { getFunctionManifest } from "./gatsby/functionsManifest";
import { CONFIG_FILE_NAME } from "./utils/constants";
import { getClientSideRoutes } from "./gatsby/clientSideRoutes";
import { getServerSideRoutes } from "./gatsby/serverRoutes";
import { getProxiesAndRedirects } from "./gatsby/proxiesAndRedirects";

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

    // @ts-ignore
    delete pluginOptions.plugins;

    const config: GatsbyNodeServerConfig = {
      ...pluginOptions,
      clientSideRoutes,
      serverSideRoutes,
      redirects,
      proxies,
      prefix: pathPrefix,
      functions,
    };

    await writeJSON(pluginData.configFolder(CONFIG_FILE_NAME), config, { spaces: 2 });
  } catch (e: any) {
    reporter.error("Error building config for Fastify Server", e, "gatsby-plugin-fastify");
  }
};

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }) => {
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
  });
};
