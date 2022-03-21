import fastifyStatic, { FastifyStaticOptions } from "fastify-static";
import fp from "fastify-plugin";
import { isMatch } from "picomatch";
import { resolve } from "path";

import type { FastifyPluginAsync } from "fastify";

import { PATH_TO_PUBLIC, IMMUTABLE_CACHING_HEADER, NEVER_CACHE_HEADER } from "../utils/constants";
import { appendModuleHeader } from "../utils/headers";

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
          reply.setHeader("cache-control", IMMUTABLE_CACHING_HEADER["cache-control"]);
        } else {
          reply.setHeader("cache-control", NEVER_CACHE_HEADER["cache-control"]);
        }
        appendModuleHeader("Static", reply);
      },
      ...opts,
    });
  }
);
