import { handleClientOnlyRoutes } from "./clientRoutes";
import { handleFunctions } from "./functions";
import { handleRedirects } from "./redirects";
import { handleReverseProxy } from "./reverseProxy";
import { handleStatic } from "./static";
import { handleServerRoutes } from "./serverRoutes";
import { handle404 } from "./404";
import { handle500 } from "./500";
import { getConfig } from "../utils/config";

import fastifyAccepts from "fastify-accepts";
import type { FastifyPluginAsync } from "fastify";

export const serveGatsby: FastifyPluginAsync = async (fastify) => {
  const { server: serverConfig } = getConfig();

  const { clientSideRoutes, serverSideRoutes, redirects, functions, proxies, features } =
    serverConfig;

  // Utils
  fastify.register(fastifyAccepts);

  // Gatsby 500 - This must be registered before anything that wants to use it
  await fastify.register(handle500, {});

  // Gatsby Functions
  await fastify.register(handleFunctions, {
    prefix: "/api/",
    functions,
  });

  // Gatsby Static
  await fastify.register(handleStatic, {});

  // Gatsby Client Only Routes
  await fastify.register(handleClientOnlyRoutes, {
    paths: clientSideRoutes,
  });

  // Gatsby Redirects
  await fastify.register(handleRedirects, { redirects });

  // Gatsby Reverse Proxy
  if (features?.reverseProxy) {
    await fastify.register(handleReverseProxy, { proxies });
  }

  // Gatsby DSG & SSR
  await fastify.register(handleServerRoutes, { paths: serverSideRoutes });

  // Gatsby 404
  await fastify.register(handle404, {});
};
