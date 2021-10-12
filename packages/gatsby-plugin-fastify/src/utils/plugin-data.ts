//This file was initially coppied from `gatsby-plugin-gatsby-cloud`

import path from "path";
import { readJSON } from "fs-extra";
import { PATH_TO_CACHE, PATH_TO_FUNCTIONS, PATH_TO_PUBLIC } from "./constants";

import type { Store } from "gatsby";
import type { IGatsbyState } from "gatsby/dist/redux/types";
import type WebpackAssetsManifest from "webpack-assets-manifest";

export function buildPrefixer(prefix: string, ...paths: string[]) {
  return (...subpaths: string[]) => path.join(prefix, ...paths, ...subpaths);
}

// This function assembles data across the manifests and store to match a similar
// shape of `static-entry.js`. With it, we can build headers that point to the correct
// hashed filenames and ensure we pull in the componentChunkName.
export async function makePluginData(
  store: Store,
  assetsManifest: WebpackAssetsManifest.Assets,
  pathPrefix: string,
): Promise<PluginData> {
  const { program, pages, components } = store.getState() as IGatsbyState;
  const publicFolder = buildPrefixer(program.directory, PATH_TO_PUBLIC);
  const functionsFolder = buildPrefixer(program.directory, PATH_TO_FUNCTIONS);
  const configFolder = buildPrefixer(program.directory, PATH_TO_CACHE);

  const stats = await readJSON(publicFolder(`webpack.stats.json`));

  // Get all the files, not just the first
  const chunkManifest = stats.assetsByChunkName;

  // We combine the manifest of JS and the manifest of assets to make a lookup table.
  const manifest = { ...assetsManifest, ...chunkManifest };

  return {
    pages,
    components,
    manifest,
    program,
    pathPrefix,
    publicFolder,
    functionsFolder,
    configFolder,
  };
}

export interface PluginData {
  pages: IGatsbyState["pages"];
  program: IGatsbyState["program"];
  components: IGatsbyState["components"];
  manifest: AssetManifest;
  pathPrefix: string;
  publicFolder: (...paths: string[]) => string;
  functionsFolder: (...paths: string[]) => string;
  configFolder: (...paths: string[]) => string;
}

export type AssetManifest = { [key: string]: string };
