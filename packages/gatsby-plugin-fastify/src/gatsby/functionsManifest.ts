import { fsync } from "fs";
import { existsSync, readJSON } from "fs-extra";
import { IGatsbyFunction } from "gatsby/dist/redux/types";
import { PluginData } from "../utils/plugin-data";
import { formatMatchPath } from "../utils/routes";

export async function getFunctionManifest(pluginData: PluginData): Promise<IGatsbyFunction[]> {
  const { functionsFolder } = pluginData;
  const compiledFunctionsDir = functionsFolder();

  if (!existsSync(compiledFunctionsDir)) {
    throw new Error(`Unable to find function mainfest @ ${compiledFunctionsDir}`);
  }

  const functions: IGatsbyFunction[] = await readJSON(functionsFolder(`manifest.json`), `utf-8`);

  return functions;
}
