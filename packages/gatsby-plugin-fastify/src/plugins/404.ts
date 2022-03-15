import { FastifyPluginAsync } from "fastify";
import { resolve } from "path";
import { existsSync } from "fs-extra";
import { PATH_TO_PUBLIC } from "../utils/constants";

import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const handle404: FastifyPluginAsync = async (fastify, _opts) => {
  const gatsby404ErrorFileExists = existsSync(resolve(PATH_TO_PUBLIC, "404.html"));
  fastify.log.info(
    `Gatsby 404 error page ${
      gatsby404ErrorFileExists ? "exists" : "missing, using generic 404 error"
    }`
  );

  fastify.setNotFoundHandler((req, reply) => {
    fastify.log.warn(`404: '${req.url}' not found.`);
    reply.appendModuleHeader("404");

    if (gatsby404ErrorFileExists) {
      reply.code(StatusCodes.NOT_FOUND).sendFile("404.html");
    } else {
      reply.code(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
  });
};
