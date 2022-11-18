import { resolve } from "node:path";

import { PATH_TO_PUBLIC } from "../utils/constants";

import type { FastifyPluginAsync } from "fastify";
import type { NoUndefinedField } from "../gatsby/client-side-route";

export type PathConfig = {
  matchPath: string | undefined;
  path: string;
};

export const handleClientOnlyRoutes: FastifyPluginAsync<{
  paths: NoUndefinedField<PathConfig>[];
}> = async (fastify, { paths }) => {
  fastify.log.info(`Registering ${paths?.length} client-only route(s)`);

  if (paths?.length > 0) {
    for (const p of paths) {
      fastify.log.debug(`Registering client-only route: ${p.path}`);

      fastify.get(p.matchPath, (_request, reply) => {
        reply.appendModuleHeader("Client Route");

        reply.sendFile("index.html", resolve(PATH_TO_PUBLIC, p.path.replace("/", "")));
      });
    }
  }
};

export default { handleClientOnlyRoutes };
