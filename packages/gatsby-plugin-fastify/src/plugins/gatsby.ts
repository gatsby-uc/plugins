// import { handle404 } from "./404";
import { handleClientOnlyPaths } from "./clientPaths";
import { handleFunctions } from "./functions";
import { handleRedirects } from "./redirects";
import { handleStatic } from "./static";
import { handleDsgSsr } from "./dsgSsr";
import { getConfig } from "../utils";

import fastifyCompress from "fastify-compress";
import type { FastifyPluginAsync } from "fastify";
import fastifyAccepts from "fastify-accepts";

export type GatsbyServerFeatureOptions = {
  compression: boolean;
};

export const serveGatsby: FastifyPluginAsync<GatsbyServerFeatureOptions> = async (fastify) => {
  //@ts-ignore
  const {
    cli: { verbose },
    server: serverConfig,
  } = getConfig();

  if (verbose) {
    console.info("Starting server with config: ", serverConfig);
  }

  const { paths, redirects, compression } = serverConfig;

  fastify.register(fastifyAccepts);

  // Optimizations
  if (compression) {
    console.info(`Compression enabled.`);
    await fastify.register(fastifyCompress, {});
  }

  // Gatsby Functions
  await fastify.register(handleFunctions, {
    prefix: "/api/",
  });

  // Gatsby Static
  await fastify.register(handleStatic, {
    wildcard: true,
  });

  // Gatsby DSG & SSR
  await fastify.register(handleDsgSsr);

  // Gatsby Client Only Routes
  await fastify.register(handleClientOnlyPaths, {
    paths,
  });

  // Gatsby Redirects
  await fastify.register(handleRedirects, { redirects });

  // Gatsby 404
  // await fastify.register(handle404, {});
};
