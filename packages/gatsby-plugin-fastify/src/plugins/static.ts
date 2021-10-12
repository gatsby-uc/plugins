import { FastifyPluginAsync } from "fastify";
import fastifyStatic, { FastifyStaticOptions } from "fastify-static";
import fp from "fastify-plugin";
import path from "path";
import { isMatch } from "micromatch";
import { IMMUTABLE_CACHING_HEADER, NEVER_CACHE_HEADER } from "../utils/constants";

export const handleStatic: FastifyPluginAsync<Partial<FastifyStaticOptions>> = fp(
  async (fastify, opts) => {
    fastify.register(fastifyStatic, {
      root: path.resolve("./public"),
      redirect: true,
      setHeaders: (reply, path, _stat) => {
        if (
          isMatch(path, ["**/public/*.@(js|css)", "**/public/static/**"]) &&
          isMatch(path, "!**/sw.js")
        ) {
          reply.setHeader(...IMMUTABLE_CACHING_HEADER);
        } else {
          reply.setHeader(...NEVER_CACHE_HEADER);
        }
      },
      ...opts,
    });
  },
);
