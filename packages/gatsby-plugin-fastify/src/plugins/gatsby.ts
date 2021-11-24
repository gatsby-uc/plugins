import { handleClientOnlyRoutes } from "./clientRoutes";
import { handleFunctions } from "./functions";
import { handleRedirects } from "./redirects";
import { handleStatic } from "./static";
import { handleServerRoutes } from "./serverRoutes";
import { handle404 } from "./404";
import { handle500 } from "./500";
import { getConfig } from "../utils/config";

import fastifyCompress from "fastify-compress";
import fastifyAccepts from "fastify-accepts";
import type { FastifyPluginAsync } from "fastify";

export const serveGatsby: FastifyPluginAsync = async (fastify) => {
  const { server: serverConfig } = getConfig();

  const { clientSideRoutes, serverSideRoutes, redirects, compression, functions } = serverConfig;

  // Utils
  fastify.register(fastifyAccepts);

  // Gatsby 500 - This must be registered before anything that wants to use it
  await fastify.register(handle500, {});

  // Optimizations
  if (compression) {
    fastify.log.info(`Compression enabled`);
    await fastify.register(fastifyCompress, {});
  }

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

  // Gatsby DSG & SSR
  await fastify.register(handleServerRoutes, { paths: serverSideRoutes });

  // Gatsby 404
  await fastify.register(handle404, {});
};
