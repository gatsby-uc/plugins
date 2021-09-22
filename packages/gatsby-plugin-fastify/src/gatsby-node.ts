import fs from "fs";
import path from "path";
import { GatsbyNodeServerConfig, CONFIG_FILE_PATH, CONFIG_FILE_NAME } from "./utils";

import type { GatsbyReduxStore } from "gatsby/dist/redux";
import type { PathConfig } from "./plugins/clientPaths";
import type { GatsbyServerFeatureOptions } from "./plugins/gatsby";
import type { PluginOptionsSchemaJoi } from "gatsby-plugin-utils";

export type GatsbyApiInput = { pathPrefix: string; store: GatsbyReduxStore };

export function onPostBuild(
  { store, pathPrefix }: GatsbyApiInput,
  pluginOptions: GatsbyServerFeatureOptions,
) {
  const { pages, redirects } = store.getState();

  const p: PathConfig[] = [];
  for (const page of pages.values()) {
    p.push({
      matchPath: page.matchPath,
      path: page.path,
    });
  }

  // @ts-ignore
  delete pluginOptions.plugins;

  const config: GatsbyNodeServerConfig = {
    ...pluginOptions,
    paths: p,
    redirects,
    prefix: pathPrefix,
  };

  if (!fs.existsSync("public/")) {
    fs.mkdirSync("public/");
  }

  fs.writeFileSync(path.join(CONFIG_FILE_PATH, CONFIG_FILE_NAME), JSON.stringify(config, null, 2));
}

export function pluginOptionsSchema({ Joi }: { Joi: PluginOptionsSchemaJoi }) {
  return Joi.object({
    compression: Joi.boolean().default(true),
    refreshEndpoint: Joi.boolean().default(true),
  });
}
