import { implementUtilDecorators } from "./decorators";
import { handleDynamic } from "./dynamic";
import { handleRedirects } from "./redirects";
import { handleStatic } from "./static";
import { handle404 } from "./404";
import { handle500 } from "./500";
import { getConfig } from "../utils/config";

import fastifyAccepts from "@fastify/accepts";
import fastifyStatic from "@fastify/static";

import type { FastifyPluginAsync } from "fastify";

export const serveGatsby: FastifyPluginAsync = async (fastify) => {
  const { server: serverConfig } = getConfig();

  const { routes, functionsManifest } = serverConfig;

  // Utils
  await fastify.register(fastifyAccepts);
  await fastify.register(implementUtilDecorators);

  // Gatsby 500 - This must be registered before anything that wants to use it
  await fastify.register(handle500);

  // Gatsby Dynamic Routes = Functions, DSG, SSR, Image Transformst, Slices, etc
  await fastify.register(handleDynamic, {
    routes: routes.dynamic,
    functions: functionsManifest,
  });

  // Gatsby Static
  await fastify.register(handleStatic, { routes: routes.static });

  // Gatsby Redirects & Reverse Proxy
  // await fastify.register(handleRedirects, { redirects: routes.redirect });

  // Gatsby 404
  await fastify.register(handle404);
};
