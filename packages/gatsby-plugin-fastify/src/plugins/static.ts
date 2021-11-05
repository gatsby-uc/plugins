import { FastifyPluginAsync } from "fastify";
import fastifyStatic, { FastifyStaticOptions } from "fastify-static";
import fp from "fastify-plugin";
import { resolve } from "path";
import { isMatch } from "picomatch";
import { PATH_TO_PUBLIC, IMMUTABLE_CACHING_HEADER, NEVER_CACHE_HEADER } from "../utils/constants";

export const handleStatic: FastifyPluginAsync<Partial<FastifyStaticOptions>> = fp(
  async (fastify, opts) => {
    const publicPath = resolve(PATH_TO_PUBLIC);
    fastify.log.debug(`Serving Static Assets from ${publicPath}`);
    fastify.register(fastifyStatic, {
      root: publicPath,
      redirect: true,
      wildcard: true,
      setHeaders: (reply, path, _stat) => {
        if (
          isMatch(path, ["**/public/*.@(js|css)", "**/public/static/**"]) &&
          isMatch(path, "!**/sw.js")
        ) {
          reply.setHeader(...IMMUTABLE_CACHING_HEADER);
        } else {
          reply.setHeader(...NEVER_CACHE_HEADER);
        }
        reply.setHeader("x-gatsby-fastify", "served-by: static");
      },
      ...opts,
    });
  },
);
