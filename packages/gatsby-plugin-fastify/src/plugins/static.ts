import fastifyStatic, { FastifyStaticOptions } from "@fastify/static";
import fp from "fastify-plugin";
import { resolve } from "node:path";
import { isMatch } from "picomatch";
import { PATH_TO_PUBLIC, IMMUTABLE_CACHING_HEADER, NEVER_CACHE_HEADER } from "../utils/constants";
import { appendModuleHeader } from "../utils/headers";

import type { FastifyPluginAsync } from "fastify";

export const handleStatic: FastifyPluginAsync<Partial<FastifyStaticOptions>> = fp(
  async (fastify, options) => {
    const publicPath = resolve(PATH_TO_PUBLIC);
    fastify.log.debug(`Serving Static Assets from ${publicPath}`);
    fastify.register(fastifyStatic, {
      root: publicPath,
      // These settings were switched to false with fastify v4, not entirely sure what changed, but tests are still passing.
      redirect: false,
      wildcard: false,
      setHeaders: (reply, path) => {
        if (
          isMatch(path, ["**/public/*.@(js|css)", "**/public/static/**"]) &&
          isMatch(path, "!**/sw.js")
        ) {
          reply.setHeader(...IMMUTABLE_CACHING_HEADER);
        } else {
          reply.setHeader(...NEVER_CACHE_HEADER);
        }
        appendModuleHeader("Static", reply);
      },
      ...options,
    });
  }
);
