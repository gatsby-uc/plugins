import { handleRefreshEndpoint } from "./refreshEndpoint";
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
import type { PluginOptions } from "gatsby";

export interface GatsbyServerFeatureOptions extends PluginOptions {
  compression: boolean;
  refreshEndpoint: boolean;
}

export const serveGatsby: FastifyPluginAsync<GatsbyServerFeatureOptions> = async (fastify) => {
  const {
    cli: { verbose },
    server: serverConfig,
  } = getConfig();

  if (verbose) {
    console.info("Starting server with config: ", serverConfig);
  }

  const { clientSideRoutes, redirects, compression, functions } = serverConfig;

  // Utils
  fastify.register(fastifyAccepts);

  // Optimizations
  if (compression) {
    console.info(`Compression enabled.`);
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

  // Gatsby Refresh Endpoint
  await fastify.register(handleRefreshEndpoint);

  // Gatsby DSG & SSR
  await fastify.register(handleDsgSsr);

  // Gatsby 404
  await fastify.register(handle404, {});
};
