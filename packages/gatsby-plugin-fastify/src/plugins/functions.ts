import path from "path";
import { existsSync } from "fs-extra";
import { IGatsbyFunction } from "gatsby/dist/redux/types";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { PATH_TO_FUNCTIONS } from "../utils/constants";

export type GatsbyFunctionHandler = (
  req: FastifyRequest,
  res: FastifyReply,
) => void | Promise<void>;

async function getFunctionToExec({
  relativeCompiledFilePath,
}: IGatsbyFunction): Promise<GatsbyFunctionHandler | null> {
  const funcImportAbsPath = path.resolve(PATH_TO_FUNCTIONS, relativeCompiledFilePath);

  if (!existsSync(funcImportAbsPath)) {
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
  return execFunction;
}

export const handleFunctions: FastifyPluginAsync<{ prefix: string; functions: IGatsbyFunction[] }> =
  async (fastify, { prefix, functions }) => {
    if (functions?.length > 0) {
      for (const funcConfig of functions) {
        const fnToExecute = await getFunctionHandler(funcConfig);

        if (fnToExecute) {
          console.info("Registering function: ", prefix + funcConfig.functionRoute);
          fastify.all(funcConfig.functionRoute, {
            handler: async function (req, reply) {
              try {
                await Promise.resolve(fnToExecute(req, reply));
              } catch (e) {
                console.error(e);
                // Don't send the error if that would cause another error.
                if (!reply.sent) {
                  reply.code(500).send("Error executing Gatsby Function.");
                }
              }
            },
          });
        }
      }
    }

    fastify.all("/*", async (_req, reply) => {
      reply.code(404).send("Function not found.");
    });
  };
