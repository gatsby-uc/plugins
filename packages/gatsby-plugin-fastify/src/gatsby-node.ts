import fs from "fs";
import type { GatsbyReduxStore } from "gatsby/dist/redux";
import type { PathConfig } from "./plugins/clientPaths";
import type { GatsbyServerFeatureOptions } from "./plugins/gatsby";
import type { GatsbyNodeServerConfig } from "./utils";
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

  fs.writeFileSync("public/gatsby-plugin-node.json", JSON.stringify(config, null, 2));
}

export function pluginOptionsSchema({ Joi }: { Joi: PluginOptionsSchemaJoi }) {
  return Joi.object({
    compression: Joi.boolean().default(true),
  });
}
