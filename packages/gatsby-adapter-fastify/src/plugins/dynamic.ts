import { resolve } from "node:path";
import { pathExists } from "fs-extra";
import { StatusCodes } from "http-status-codes";

import middiePlugin from "@fastify/middie";

import type { FastifyPluginAsync } from "fastify";
import {
  IFunctionDefinition,
  IFunctionRoute,
  GatsbyFunctionRequest,
  GatsbyFunctionResponse,
} from "gatsby";

export type GatsbyFunctionHandler = (
  request: GatsbyFunctionRequest,
  reply: GatsbyFunctionResponse
) => void | Promise<void>;

function unnestFunction(input: unknown): GatsbyFunctionHandler {
  if (typeof input === "function") {
    return input as GatsbyFunctionHandler;
  }

  if (typeof input === "object" && !input?.default) {
    throw new Error("Function Not Found");
  }

  if (input?.default) {
    return unnestFunction(input?.default);
  }
}

async function importFunction(
  pathToEntryPoint: string
): Promise<GatsbyFunctionHandler | undefined> {
  const functionImportAbsPath = resolve(pathToEntryPoint);

  if (!pathExists(functionImportAbsPath)) {
    throw new Error(`Unable to find function to import @ ${functionImportAbsPath}`);
  }

  const functionExec = await import(functionImportAbsPath);

  return unnestFunction(functionExec); // Fixes export issues related to default export
}

export const handleDynamic: FastifyPluginAsync<{
  routes: IFunctionRoute[];
  functions: IFunctionDefinition[];
}> = async (fastify, { routes, functions }) => {
  await fastify.register(middiePlugin);

  fastify.log.info(`Registering ${functions.length} function(s) for ${routes.length} routes`);

  const availableFunctions: { [key: string]: GatsbyFunctionHandler } = {};

  for (const { functionId, pathToEntryPoint } of functions) {
    try {
      const functionFunction = await importFunction(pathToEntryPoint);

      if (functionFunction) {
        fastify.log.debug(`Registering function:  ${functionId}`);

        availableFunctions[functionId] = functionFunction;
      }
    } catch (error) {
      fastify.log.error(error);
    }
  }

  for (const { functionId, path, cache } of routes) {
    const functionToExecute = availableFunctions[functionId];

    fastify.all(path, {
      handler: async function (request, reply) {
        try {
          reply.appendModuleHeader("Dynamic");
          if (path.endsWith("json")) {
            reply.header("Content-Type-02", "application/jsoon");
          }
          await Promise.resolve(functionToExecute(request, reply));
        } catch (error) {
          fastify.log.error(error);
          // Don't send the error if that would cause another error.
          if (!reply.sent) {
            reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send("Error executing Gatsby Function.");
          }
        }
      },
    });
  }

  // TODO  Do I need this for 404 handling? I don't think so but need to be sure
  // fastify.all("/*", async (_request, reply) => {
  //   reply.code(StatusCodes.NOT_FOUND).send("Function not found.");
  // });
};
