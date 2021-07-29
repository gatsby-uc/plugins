import { handle404 } from "./404";
import { handleClientOnlyPaths } from "./clientPaths";
import { handleFunctions } from "./functions";
import { handleRedirects } from "./redirects";
import { handleStatic } from "./static";

import type { FastifyPluginAsync } from "fastify";
import type { IRedirect } from "gatsby/dist/redux/types";
import type { PathConfig } from "./clientPaths";

export const serveGatsby: FastifyPluginAsync<{
  paths: PathConfig[];
  redirects: IRedirect[];
  compression?: boolean;
}> = async (fastify, { paths, redirects, compression = true }) => {
  // Optimizations
  if (compression) {
    await fastify.register(require("fastify-compress"));
  }

  // Gatsby Functions
  await fastify.register(handleFunctions, {
    prefix: "/api/",
  });
  // Gatsby Static

  await fastify.register(handleStatic, {});

  // Gatsby Client Only Routes

  await fastify.register(handleClientOnlyPaths, {
    paths,
  });

  // Gatsby Redirects
  await fastify.register(handleRedirects, { redirects });

  // Gatsby 404
  await fastify.register(handle404, {});
};
