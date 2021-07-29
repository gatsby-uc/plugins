import { FastifyPluginAsync } from "fastify";
import fastifyStatic, { FastifyStaticOptions } from "fastify-static";
import fp from "fastify-plugin";
import path from "path";

export const handleStatic: FastifyPluginAsync<Partial<FastifyStaticOptions>> = fp(
  async (fastify, opts) => {
    fastify.register(fastifyStatic, {
      root: path.resolve("./public"),
      redirect: true,
      ...opts,
    });
  },
);
