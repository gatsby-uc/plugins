import fs from "fs";
import type { GatsbyReduxStore } from "gatsby/dist/redux";
import type { PathConfig } from "./plugins/clientPaths";
import type { GatsbyNodeServerConfig } from "./utils";

export type GatsbyApiInput = { pathPrefix: string; store: GatsbyReduxStore };

function generateConfig({ pathPrefix, store }: GatsbyApiInput) {
  const { pages, redirects } = store.getState();

  const p: PathConfig[] = [];
  for (const page of pages.values()) {
    p.push({
      matchPath: page.matchPath,
      path: page.path,
    });
  }

  const config: GatsbyNodeServerConfig = {
    paths: p,
    redirects,
    pathPrefix,
  };

  if (!fs.existsSync("public/")) {
    fs.mkdirSync("public/");
  }

  fs.writeFileSync("public/gatsby-plugin-node.json", JSON.stringify(config, null, 2));
}

exports.onPostBuild = function ({ store, pathPrefix }) {
  generateConfig({ pathPrefix, store });
};
