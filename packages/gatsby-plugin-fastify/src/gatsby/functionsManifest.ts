import { existsSync, readJSON } from "fs-extra";
import { IGatsbyFunction } from "gatsby/dist/redux/types";
import { PluginData } from "../utils/plugin-data";

export async function getFunctionManifest(pluginData: PluginData): Promise<IGatsbyFunction[]> {
  const { functionsFolder } = pluginData;
  const compiledFunctionsDir = functionsFolder();
  let functions: IGatsbyFunction[] = [];

  if (!existsSync(compiledFunctionsDir)) {
    console.error("Unable to find function mainfest @ ", compiledFunctionsDir);
    return functions;
  }

  try {
    functions = await readJSON(functionsFolder(`manifest.json`), `utf-8`);
  } catch (e) {
    // ignore
  }

  return functions;
}
