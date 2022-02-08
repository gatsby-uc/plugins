import { resolve } from "path";
import { existsSync } from "fs-extra";
import { IGatsbyFunction } from "gatsby/dist/redux/types";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { PATH_TO_FUNCTIONS } from "../utils/constants";
import { appendModuleHeader } from "../utils/headers";

export type GatsbyFunctionHandler = (
  req: FastifyRequest,
  res: FastifyReply
) => void | Promise<void>;

async function getFunctionToExec({
  relativeCompiledFilePath,
}: IGatsbyFunction): Promise<GatsbyFunctionHandler | null> {
  const funcImportAbsPath = resolve(PATH_TO_FUNCTIONS, relativeCompiledFilePath);

  if (!existsSync(funcImportAbsPath)) {
    throw new Error(`Unable to find function to import @ ${funcImportAbsPath}`);
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

export const handleFunctions: FastifyPluginAsync<{
  prefix: string;
  functions: IGatsbyFunction[];
}> = async (fastify, { prefix, functions }) => {
  if (functions?.length > 0) {
    fastify.log.info(`Registering ${functions.length} function(s)`);

    for (const funcConfig of functions) {
      try {
        const fnToExecute = await getFunctionHandler(funcConfig);

        if (fnToExecute) {
          fastify.log.debug(`Registering function:  ${prefix + funcConfig.functionRoute}`);
          fastify.all(funcConfig.functionRoute, {
            handler: async function (req, reply) {
              try {
                appendModuleHeader("Functions", reply);
                await Promise.resolve(fnToExecute(req, reply));
              } catch (e) {
                fastify.log.error(e);
                // Don't send the error if that would cause another error.
                if (!reply.sent) {
                  reply.code(500).send("Error executing Gatsby Function.");
                }
              }
            },
          });
        }
      } catch (e) {
        fastify.log.error(e);
      }
    }
  }

  fastify.all("/*", async (_req, reply) => {
    reply.code(404).send("Function not found.");
  });
};
