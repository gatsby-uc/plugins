import { FastifyPluginAsync } from "fastify";

export const handle404: FastifyPluginAsync<{}> = async (fastify, _opts) => {
  fastify.setNotFoundHandler((_req, reply) => {
    reply.code(404).sendFile("404.html");
  });
};
