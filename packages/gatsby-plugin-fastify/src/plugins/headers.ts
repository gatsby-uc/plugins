import fp from "fastify-plugin";

import type { FastifyPluginAsync } from "fastify";

export const implementCustomHeaders: FastifyPluginAsync<{}> = fp(async (fastify) => {
  fastify.addHook(`onSend`, async (_request, reply, payload) => {
    reply.header("X-Custom-Header", "Hello World");
    return payload;
  });
});
