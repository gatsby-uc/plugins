import path from "path";

import type { FastifyPluginAsync } from "fastify";

export type PathConfig = {
  matchPath: string | undefined;
  path: string;
};

export const handleClientOnlyPaths: FastifyPluginAsync<{
  paths: PathConfig[];
}> = async (fastify, { paths }) => {
  for (const p of paths) {
    if (p?.matchPath) {
      console.info("Registering client-only route: ", p.path);

      fastify.get(p.matchPath, (_req, reply) => {
        console.log("matched path");
        reply.sendFile("index.html", path.resolve("./public", p.path.replace("/", "")));
      });
    }
  }
};
