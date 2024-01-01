import { resolve } from "node:path";

import fastifyStatic from "@fastify/static";
import fp from "fastify-plugin";

import type { FastifyPluginAsync } from "fastify";
import { StaticRoute } from "../utils/config";
import { PATH_TO_PUBLIC } from "../utils/constants";
import { appendModuleHeader } from "../utils/headers";

//TODO Fix static file serving, still not sure it has the control we need, and need to solve headers.
export const handleStatic: FastifyPluginAsync<{
  routes: StaticRoute[];
}> = fp(async (fastify, { routes }) => {
  const publicPath = resolve(PATH_TO_PUBLIC);
  fastify.log.debug(`Serving Static Assets from ${publicPath}`);
  await fastify.register(fastifyStatic, {
    root: publicPath,
    setHeaders: (reply, path) => {
      appendModuleHeader("Static", reply);
    },
    // wildcard: false,
    // redirect: true,
    // serve: true,
    //TODO: I have to provide a root but shouldn't need to ;(
  });

  //TODO: The find-my-way router doesn't support wildcards in middle of routes as Gatsby makes them. Need a work around.
  // for (const route of routes) {
  //   fastify.get(route.path, async (_request, reply) => {
  //     reply.headers(route.headers);
  //     reply.appendModuleHeader("Static");
  //     reply.sendFile(route.filePath);
  //   });
  // }
});
