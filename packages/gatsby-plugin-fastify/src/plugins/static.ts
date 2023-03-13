import fastifyStatic, { FastifyStaticOptions } from "@fastify/static";
import fp from "fastify-plugin";
import { resolve } from "node:path";
import { PATH_TO_PUBLIC } from "../utils/constants";
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
      setHeaders: (reply) => {
        appendModuleHeader("Static", reply);
      },
      ...options,
    });
  }
);
