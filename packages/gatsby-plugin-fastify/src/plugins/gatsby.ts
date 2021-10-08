import { handle404 } from "./404";
import { handleClientOnlyPaths } from "./clientPaths";
import { handleFunctions } from "./functions";
import { handleRedirects } from "./redirects";
import { handleStatic } from "./static";
import { getConfig } from "../utils/config";

import fastifyCompress from "fastify-compress";
import fastifyEarlyHints from "fastify-early-hints";
import type { FastifyPluginAsync } from "fastify";
import type { PluginOptions } from "gatsby";

export interface GatsbyServerFeatureOptions extends PluginOptions {
  compression: boolean;
  preloadLinkHeaders: boolean;
  earlyHints: boolean;
}

export const serveGatsby: FastifyPluginAsync<GatsbyServerFeatureOptions> = async (fastify) => {
  //@ts-ignore
  const {
    cli: { verbose },
    server: serverConfig,
  } = getConfig();

  if (verbose) {
    console.info("Starting server with config: ", serverConfig);
  }

  const { clientSideRoutes, redirects, compression, functions, earlyHints } = serverConfig;

  // Optimizations
  if (compression) {
    console.info(`Compression enabled.`);
    await fastify.register(fastifyCompress, {});
  }

  if (earlyHints) {
    console.info(`Early hints enabled.`);
    await fastify.register(fastifyEarlyHints);
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

  // Gatsby 404
  await fastify.register(handle404, {});
};
