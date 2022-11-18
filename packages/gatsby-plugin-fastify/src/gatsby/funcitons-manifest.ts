import { existsSync, readJSON } from "fs-extra";
import { IGatsbyFunction } from "gatsby/dist/redux/types";
import { PluginData } from "../utils/plugin-data";

export async function getFunctionManifest(pluginData: PluginData): Promise<IGatsbyFunction[]> {
  const { functionsFolder } = pluginData;
  const compiledFunctionsDirectory = functionsFolder();

  if (!existsSync(compiledFunctionsDirectory)) {
    throw new Error(`Unable to find function mainfest @ ${compiledFunctionsDirectory}`);
  }

  const functions: IGatsbyFunction[] = await readJSON(functionsFolder(`manifest.json`), `utf-8`);

  return functions;
}
