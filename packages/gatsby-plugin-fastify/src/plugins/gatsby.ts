import { handleClientOnlyPaths } from "./clientPaths";
import { handleFunctions } from "./functions";
import { handleRedirects } from "./redirects";
import { handleStatic } from "./static";
import { handleDsgSsr } from "./dsgSsr";
import { handle404 } from "./404";
import { getConfig } from "../utils/config";

import fastifyCompress from "fastify-compress";
import fastifyAccepts from "fastify-accepts";
import type { FastifyPluginAsync } from "fastify";

export const serveGatsby: FastifyPluginAsync = async (fastify) => {
  //@ts-ignore
  const { server: serverConfig } = getConfig();

  const { clientSideRoutes, serverSideRoutes, redirects, compression, functions } = serverConfig;

  // Utils
  fastify.register(fastifyAccepts);

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
  await fastify.register(handleClientOnlyPaths, {
    paths: clientSideRoutes,
  });

  // Gatsby Redirects
  await fastify.register(handleRedirects, { redirects });

  // Gatsby DSG & SSR
  await fastify.register(handleDsgSsr, { paths: serverSideRoutes });

  // Gatsby 404
  await fastify.register(handle404, {});
};
