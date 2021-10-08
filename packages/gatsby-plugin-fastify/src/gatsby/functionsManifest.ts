import { existsSync, readJSON } from "fs-extra";
import { IGatsbyFunction } from "gatsby/dist/redux/types";

export default async function getFunctionManifest(pluginData): Promise<IGatsbyFunction[]> {
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
