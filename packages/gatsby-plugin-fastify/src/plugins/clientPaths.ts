import path from "path";

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
    console.info("Registering client-only route: ", p.path);

    fastify.get(p.matchPath, (_req, reply) => {
      reply.sendFile("index.html", path.resolve("./public", p.path.replace("/", "")));
    });
  }
};
