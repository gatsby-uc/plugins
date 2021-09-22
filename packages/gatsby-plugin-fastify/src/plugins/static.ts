import { FastifyPluginAsync } from "fastify";
import fastifyStatic, { FastifyStaticOptions } from "fastify-static";
import fp from "fastify-plugin";
import path from "path";
import { isMatch } from "picomatch";

export const handleStatic: FastifyPluginAsync<Partial<FastifyStaticOptions>> = fp(
  async (fastify, opts) => {
    fastify.register(fastifyStatic, {
      root: path.resolve("./public"),
      wildcard: false,
      setHeaders: (reply, path, _stat) => {
        if (
          isMatch(path, ["**/public/*.@(js|css)", "**/public/static/**"]) &&
          isMatch(path, "!**/sw.js")
        ) {
          reply.setHeader("cache-control", "public, max-age=31536000, immutable");
        } else {
          reply.setHeader("cache-control", "public, max-age=0, must-revalidate");
        }
        reply.setHeader("x-gatsby-fastify", "served-by: static");
      },
      ...opts,
    });
  },
);
