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

      //TODO: This code only works because I've editted the fastify-static implementation to not encodeURI on file names. https://github.com/fastify/fastify-static/issues/234
      //TODO: Work around for https://github.com/fastify/fastify/issues/3331
      const fastifyMatchPath = p.matchPath.replace(/\/\*$/, "*");

      fastify.get(
        fastifyMatchPath,
        {
          exposeHeadRoute: true,
          prefixTrailingSlash: 'slash',
        },
        (_req, reply) => {

          reply.sendFile("index.html", path.resolve("./public", p.path.replace("/", "")));

        },
      );
    }
  }
};
