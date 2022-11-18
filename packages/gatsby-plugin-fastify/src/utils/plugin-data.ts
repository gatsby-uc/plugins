//This file was initially coppied from `gatsby-plugin-gatsby-cloud`

import { join } from "node:path";
import { PATH_TO_CACHE, PATH_TO_FUNCTIONS, PATH_TO_PUBLIC } from "./constants";
import type { Store } from "gatsby";
import { IGatsbyState } from "gatsby/dist/redux/types";

export function buildPrefixer(prefix: string, ...paths: string[]) {
  return (...subpaths: string[]) => join(prefix, ...paths, ...subpaths);
}

// This function assembles data across the manifests and store to match a similar
// shape of `static-entry.js`. With it, we can build headers that point to the correct
// hashed filenames and ensure we pull in the componentChunkName.
export async function makePluginData(store: Store, pathPrefix: string): Promise<PluginData> {
  const { program, pages } = store.getState() as IGatsbyState;

  const publicFolder = buildPrefixer(program.directory, PATH_TO_PUBLIC);
  const functionsFolder = buildPrefixer(program.directory, PATH_TO_FUNCTIONS);
  const configFolder = buildPrefixer(program.directory, PATH_TO_CACHE);

  return {
    pages,
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
  pathPrefix: string;
  publicFolder: (...paths: string[]) => string;
  functionsFolder: (...paths: string[]) => string;
  configFolder: (...paths: string[]) => string;
}
