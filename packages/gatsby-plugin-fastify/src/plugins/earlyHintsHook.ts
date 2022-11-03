import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { GatsbyNodeServerConfig } from "../utils/config";

export type PathConfig = {
  matchPath: string | undefined;
  path: string;
};

export const handleEarlyHints: FastifyPluginAsync<{
  preloadLinks: GatsbyNodeServerConfig["preloadLinks"][];
}> = fp(async (fastify, { preloadLinks }) => {
  fastify.log.info(`Early Hints enabled`);

  fastify.addHook("preHandler", async (req, reply) => {
    // Get links for this route
    const { routerPath } = req;

    //TODO: This needs to handle path variatios e.g /example vs /example/ and Gatsby client routes, match paths, etc.
    const links: string[] = preloadLinks[routerPath];

    // Send Links for Early Hints
    await reply.writeEarlyHintsLinks(links);
  });
});
