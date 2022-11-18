import { resolve } from "node:path";
import { existsSync } from "fs-extra";
import { StatusCodes } from "http-status-codes";

import { PATH_TO_FUNCTIONS } from "../utils/constants";

import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { IGatsbyFunction } from "gatsby/dist/redux/types";

export type GatsbyFunctionHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => void | Promise<void>;

async function getFunctionToExec({
  relativeCompiledFilePath,
}: IGatsbyFunction): Promise<GatsbyFunctionHandler | undefined> {
  const functionImportAbsPath = resolve(PATH_TO_FUNCTIONS, relativeCompiledFilePath);

  if (!existsSync(functionImportAbsPath)) {
    throw new Error(`Unable to find function to import @ ${functionImportAbsPath}`);
  }

  const function_ = await import(functionImportAbsPath);
  return function_?.default ?? function_;
}

async function getFunctionHandler(routeConfig: IGatsbyFunction) {
  const execFunction = await getFunctionToExec(routeConfig);

  return execFunction;
}

export const handleFunctions: FastifyPluginAsync<{
  prefix: string;
  functions: IGatsbyFunction[];
}> = async (fastify, { prefix, functions }) => {
  if (functions?.length > 0) {
    fastify.log.info(`Registering ${functions.length} function(s)`);

    for (const functionConfig of functions) {
      try {
        const functionToExecute = await getFunctionHandler(functionConfig);

        if (functionToExecute) {
          const path = functionConfig?.matchPath || functionConfig.functionRoute;
          fastify.log.debug(`Registering function:  ${prefix + path}`);
          fastify.all(path, {
            handler: async function (request, reply) {
              try {
                reply.appendModuleHeader("Functions");
                await Promise.resolve(functionToExecute(request, reply));
              } catch (error) {
                fastify.log.error(error);
                // Don't send the error if that would cause another error.
                if (!reply.sent) {
                  reply
                    .code(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send("Error executing Gatsby Function.");
                }
              }
            },
          });
        }
      } catch (error) {
        fastify.log.error(error);
      }
    }
  }

  fastify.all("/*", async (_request, reply) => {
    reply.code(StatusCodes.NOT_FOUND).send("Function not found.");
  });
};
