import path from "path";

import { PATH_TO_PUBLIC } from "../utils/constants";

import type { FastifyPluginAsync } from "fastify";
import type { NoUndefinedField } from "../gatsby/clientSideRoutes";

export type PathConfig = {
  matchPath: string | undefined;
  path: string;
};

export const handleClientOnlyPaths: FastifyPluginAsync<{
  paths: NoUndefinedField<PathConfig>[];
}> = async (fastify, { paths }) => {
  for (const p of paths) {
    fastify.log.info(`Registering client-only route: ${p.path}`);

    fastify.get(p.matchPath, (_req, reply) => {
      reply.sendFile("index.html", path.resolve(PATH_TO_PUBLIC, p.path.replace("/", "")));
    });
  }
};
