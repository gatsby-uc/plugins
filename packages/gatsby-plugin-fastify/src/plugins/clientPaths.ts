import { resolve } from "path";

import { PATH_TO_PUBLIC } from "../utils/constants";

import type { FastifyPluginAsync } from "fastify";
import type { NoUndefinedField } from "../gatsby/clientSideRoutes";
import { appendModuleHeader } from "../utils/headers";

export type PathConfig = {
  matchPath: string | undefined;
  path: string;
};

export const handleClientOnlyPaths: FastifyPluginAsync<{
  paths: NoUndefinedField<PathConfig>[];
}> = async (fastify, { paths }) => {
  fastify.log.info(`Registering ${paths?.length} client-only route(s)`);

  if (paths?.length > 0) {
    for (const p of paths) {
      fastify.log.debug(`Registering client-only route: ${p.path}`);

      // This code only works because I've editted the fastify-static implementation to not encodeURI on file names. https://github.com/fastify/fastify-static/issues/234
      // Work around for https://github.com/fastify/fastify/issues/3331
      // Update, SSR/DSG was implemented without wildcard so this was not an issue. In the future we may need to change this back if we revert to not sildcarding static routes.
      // const fastifyMatchPath = p.matchPath.replace(/\/\*$/, "*");

      fastify.get(p.matchPath, (_req, reply) => {
        appendModuleHeader("CSR", reply);
        reply.sendFile("index.html", resolve(PATH_TO_PUBLIC, p.path.replace("/", "")));
      });
    }
  }
};
