import { writeJSON } from "fs-extra";
import WebpackAssetsManifest from "webpack-assets-manifest";
import type { GatsbyNode } from "gatsby";
import type { GatsbyFastifyPluginOptions, GatsbyNodeServerConfig } from "./utils/config";

import { BUILD_CSS_STAGE, BUILD_HTML_STAGE, CONFIG_FILE_NAME } from "./utils/constants";
import { getPreloadLinks } from "./gatsby/preloadLinks";
import { getFunctionManifest } from "./gatsby/functionsManifest";
import { hasFeature } from "gatsby-plugin-utils";

import { makePluginData } from "./utils/plugin-data";
import { getClientSideRoutes } from "./gatsby/clientSideRoutes";
import { getServerSideRoutes } from "./gatsby/serverRoutes";
import { getProxiesAndRedirects } from "./gatsby/proxiesAndRedirects";

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
    const pluginData = await makePluginData(store, assetsManifest, pathPrefix);

    const functions = await getFunctionManifest(pluginData);
    const clientSideRoutes = await getClientSideRoutes(pluginData);
    const serverSideRoutes = await getServerSideRoutes(pluginData);
    const preloadLinkList = await getPreloadLinks(pluginData, pluginOptions);

    // @ts-ignore
    delete pluginOptions.plugins;

    const config: GatsbyNodeServerConfig = {
      ...pluginOptions,
      clientSideRoutes,
      serverSideRoutes,
      redirects,
      proxies,
      prefix: pathPrefix,
      preloadLinks: preloadLinkList,
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
      earlyHints: Joi.boolean().default(true),
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
