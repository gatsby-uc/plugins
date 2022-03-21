import fastifyStatic, { FastifyStaticOptions } from "fastify-static";
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

import { resolve } from "path";
import { isMatch } from "picomatch";

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
          reply.headers(IMMUTABLE_CACHING_HEADER);
        } else {
          reply.headers(NEVER_CACHE_HEADER);
        }
        appendModuleHeader("Static", reply);
      },
      ...opts,
    });
  }
);
