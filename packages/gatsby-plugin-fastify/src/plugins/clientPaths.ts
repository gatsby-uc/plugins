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

    //TODO: This code only works because I've editted the fastify-static implementation to not encodeURI on file names. https://github.com/fastify/fastify-static/issues/234
    //TODO: Work around for https://github.com/fastify/fastify/issues/3331
    const fastifyMatchPath = p.matchPath.replace(/\/\*$/, "*");

    fastify.get(
      fastifyMatchPath,
      {
        exposeHeadRoute: true,
        prefixTrailingSlash: "slash",
      },
      (_req, reply) => {
        reply.header("x-gatsby-fastify", `served-by: client-only-routes`);
        reply.sendFile("index.html", path.resolve(PATH_TO_PUBLIC, p.path.replace("/", "")));
      },
    );
  }
};
