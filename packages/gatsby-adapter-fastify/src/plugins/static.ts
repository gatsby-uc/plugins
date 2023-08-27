import type { FastifyPluginAsync } from "fastify";
import type { IStaticRoute } from "gatsby";

export const handleStatic: FastifyPluginAsync<{
  routes: IStaticRoute[];
}> = async (fastify, { routes }) => {
  for (const route of routes) {
    fastify.get(route.path, { exposeHeadRoute: true }, async (_request, reply) => {
      reply.headers(route.headers);
      reply.appendModuleHeader("Static");
      reply.sendFile(route.filePath);
    });
  }
};
