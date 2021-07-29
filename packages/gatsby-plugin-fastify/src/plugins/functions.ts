import path from "path";
import fs from "fs";
import { IGatsbyFunction } from "gatsby/dist/redux/types";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

const PATH_TO_FUNCTIONS = "./.cache/functions/";

function getRoute({ functionRoute }: IGatsbyFunction) {
  return path.posix.join("/api", functionRoute);
}

export type GatsbyFunctionHandler = (
  req: FastifyRequest,
  res: FastifyReply,
) => void | Promise<void>;

async function getFunctionToExec({
  relativeCompiledFilePath,
}: IGatsbyFunction): Promise<GatsbyFunctionHandler | null> {
  const funcImportAbsPath = path.resolve(PATH_TO_FUNCTIONS, relativeCompiledFilePath);

  if (!fs.existsSync(funcImportAbsPath)) {
    console.error("Unable to find function to import @ ", funcImportAbsPath);
    return null;
  }

  const func = await import(funcImportAbsPath);
  return func?.default ?? func;
}

async function getFunctionHandler(routeConfig: IGatsbyFunction) {
  const execFunction = await getFunctionToExec(routeConfig);

  if (!execFunction) {
    return null;
  }
  return logFunctionExec(execFunction, getRoute(routeConfig));
}

function logFunctionExec(func: GatsbyFunctionHandler, path: string): GatsbyFunctionHandler {
  return async (req, res) => {
    const start = Date.now();

    await func(req, res);

    const end = Date.now();
    console.info(`Executed function "${path}" in ${end - start}ms`);
  };
}

function getFunctionManifest(): IGatsbyFunction[] {
  const compiledFunctionsDir = path.resolve(`.cache`, `functions`);
  let functions: IGatsbyFunction[] = [];

  if (!fs.existsSync(compiledFunctionsDir)) {
    console.error("Unable to find funciton mainfest @ ", compiledFunctionsDir);
    return functions;
  }

  try {
    functions = JSON.parse(
      fs.readFileSync(path.join(compiledFunctionsDir, `manifest.json`), `utf-8`),
    );
  } catch (e) {
    // ignore
  }

  return functions;
}

export const handleFunctions: FastifyPluginAsync<{}> = async (fastify, _opts) => {
  const functions = getFunctionManifest();

  if (functions?.length > 0) {
    for (const funcConfig of functions) {
      const route = getRoute(funcConfig);
      const fnToExecute = await getFunctionHandler(funcConfig);

      if (fnToExecute) {
        console.info("Registering Gatsby Function: ", route);
        fastify.all(route, {
          handler: async function (req, reply) {
            try {
              await Promise.resolve(fnToExecute(req, reply));
            } catch (e) {
              console.error(e);
              // Don't send the error if that would cause another error.
              if (!reply.sent) {
                reply.code(500).send("Error executing Gatsby Funciton.");
              }
            }
          },
        });
      }
    }
  }
};
