import { FastifyPluginAsync } from "fastify";
import { resolve } from "node:path";
import { existsSync } from "fs-extra";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

import { PATH_TO_PUBLIC } from "../utils/constants";
import { handleGatsbyTrailingSlash } from "../utils/routes";
import { TrailingSlash } from "gatsby-page-utils";

export const handle404: FastifyPluginAsync<{
  trailingSlash: TrailingSlash;
}> = async (fastify, { trailingSlash }) => {
  const gatsby404ErrorFileExists = existsSync(resolve(PATH_TO_PUBLIC, "404.html"));
  fastify.log.info(
    `Gatsby 404 error page ${
      gatsby404ErrorFileExists ? "exists" : "missing, using generic 404 error"
    }`
  );

  fastify.setNotFoundHandler((request, reply) => {
    fastify.log.warn(`404: '${request.url}' not found.`);
    reply.appendModuleHeader("404");

    //Handle potential trailingSlash issues
    const potentialTrailingSlashRedirect = handleGatsbyTrailingSlash(request.url, trailingSlash);
    if (potentialTrailingSlashRedirect !== request.url) {
      reply.redirect(StatusCodes.MOVED_PERMANENTLY, potentialTrailingSlashRedirect);
    } else if (gatsby404ErrorFileExists) {
      reply.code(StatusCodes.NOT_FOUND).sendFile("404.html");
    } else {
      reply.code(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
  });
};
