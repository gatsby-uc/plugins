//This file was initially coppied from `gatsby-plugin-gatsby-cloud`

import path from "path";
import fs from "fs-extra";
import { PATH_TO_CACHE, PATH_TO_FUNCTIONS, PATH_TO_PUBLIC } from "./constants";
import type { Store } from "gatsby";
import type WebpackAssetsManifest from "webpack-assets-manifest";

export function buildPrefixer(prefix, ...paths) {
  return (...subpaths) => path.join(prefix, ...paths, ...subpaths);
}

// This function assembles data across the manifests and store to match a similar
// shape of `static-entry.js`. With it, we can build headers that point to the correct
// hashed filenames and ensure we pull in the componentChunkName.
export default function makePluginData(
  store: Store,
  assetsManifest: WebpackAssetsManifest.Assets,
  pathPrefix: string,
) {
  const { program, pages, components } = store.getState();
  const publicFolder = buildPrefixer(program.directory, PATH_TO_PUBLIC);
  const functionsFolder = buildPrefixer(program.directory, PATH_TO_FUNCTIONS);
  const configFolder = buildPrefixer(program.directory, PATH_TO_CACHE);

  const stats = fs.readJSONSync(publicFolder(`webpack.stats.json`));
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
