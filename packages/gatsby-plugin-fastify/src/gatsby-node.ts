import { writeJSON } from "fs-extra";

import { hasFeature } from "gatsby-plugin-utils";

import type { GatsbyFastifyPluginOptions, GatsbyNodeServerConfig } from "./utils/config";
import type { GatsbyNode } from "gatsby";

import { makePluginData } from "./utils/plugin-data";
import { getFunctionManifest } from "./gatsby/funcitons-manifest";
import { CONFIG_FILE_NAME } from "./utils/constants";
import { getClientSideRoutes } from "./gatsby/client-side-route";
import { getServerSideRoutes } from "./gatsby/server-routes";
import { getProxiesAndRedirects } from "./gatsby/proxies-and-redirects";

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
    };

    await writeJSON(pluginData.configFolder(CONFIG_FILE_NAME), config, { spaces: 2 });
  } catch (error) {
    if (error instanceof Error) {
      reporter.error("Error building config for Fastify Server", error, "gatsby-plugin-fastify");
    }
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
    fastify: Joi.object({
      maxParamLength: Joi.number().default(500),
      ignoreTralingSlash: Joi.boolean().default(true),
    }).unknown(true),
  });
};
