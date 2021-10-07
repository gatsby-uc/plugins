import { writeFile, existsSync, mkdir } from "fs-extra";

import type { GatsbyReduxStore } from "gatsby/dist/redux";
import WebpackAssetsManifest from "webpack-assets-manifest";
import { GatsbyNode } from "gatsby";

import makePluginData from "./utils/plugin-data";
import type { PathConfig } from "./plugins/clientPaths";
import type { GatsbyServerFeatureOptions } from "./plugins/gatsby";
import type { GatsbyNodeServerConfig } from "./utils";
import { BUILD_CSS_STAGE, BUILD_HTML_STAGE } from "./utils/constants";
import { preloadLinks } from "./utils/preloadLinks";

export type GatsbyApiInput = { pathPrefix: string; store: GatsbyReduxStore };

const assetsManifest = {};

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
  { store, pathPrefix },
  pluginOptions: GatsbyServerFeatureOptions,
) => {
  const { pages, redirects } = store.getState();
  const pluginData = makePluginData(store, assetsManifest, pathPrefix);

  // list all paths for client-only redirects later
  //TODO: This could use some cleanup
  const p: PathConfig[] = [];
  for (const page of pages.values()) {
    p.push({
      matchPath: page.matchPath,
      path: page.path,
    });
  }

  // Handle Data needed for preload hints
  const preloadLinkList = await preloadLinks(pluginData, pluginOptions);

  // @ts-ignore
  delete pluginOptions.plugins;

  const config: GatsbyNodeServerConfig = {
    ...pluginOptions,
    paths: p,
    redirects,
    prefix: pathPrefix,
    preloadLinks: preloadLinkList,
  };

  // create cache if it doesn't exist for some reason.
  if (!existsSync(".cache/")) {
    await mkdir("./.cache");
  }

  await writeFile(
    pluginData.cacheFolder("gatsby-plugin-fastify.json"),
    JSON.stringify(config, null, 2),
  );
};

export const pluginOptionsSchema: GatsbyNode["pluginOptionsSchema"] = ({ Joi }) => {
  return Joi.object({
    compression: Joi.boolean().default(true),
    preloadLinkHeaders: Joi.boolean().default(true),
  });
};
