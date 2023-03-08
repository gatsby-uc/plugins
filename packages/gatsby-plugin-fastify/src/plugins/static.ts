import fastifyStatic, { FastifyStaticOptions } from "@fastify/static";
import fp from "fastify-plugin";
import { resolve } from "node:path";
import { PATH_TO_PUBLIC } from "../utils/constants";
import { appendModuleHeader, appendRouteHeaders } from "../utils/headers";

import type { FastifyPluginAsync } from "fastify";

export const handleStatic: FastifyPluginAsync<Partial<FastifyStaticOptions>> = fp(
  async (fastify, options) => {
    // console.log("handleStatic", {fastify});
    const publicPath = resolve(PATH_TO_PUBLIC);
    fastify.log.debug(`Serving Static Assets from ${publicPath}`);
    fastify.register(fastifyStatic, {
      root: publicPath,
      // These settings were switched to false with fastify v4, not entirely sure what changed, but tests are still passing.
      redirect: false,
      wildcard: false,
      setHeaders: (reply, path) => {
        const barePath = path.replace(publicPath, ``).replace(/\\/g, `/`);
        // console.log("\n\nsetHeaders", {path, barePath, publicPath}, "\n\n")
        appendRouteHeaders(barePath, reply);
        appendModuleHeader("Static", reply);
      },
      ...options,
    });
  }
);
