import { FastifyPluginAsync } from "fastify";
import path from "path";
import fs from "fs-extra";
import { PATH_TO_PUBLIC } from "../utils/constants";

export const handle404: FastifyPluginAsync<{}> = async (fastify, _opts) => {
  const gatsby404ErrorFileExists = fs.existsSync(path.resolve(PATH_TO_PUBLIC, "404.html"));
  fastify.log.info(
    `Gatsby 404 error page ${
      gatsby404ErrorFileExists ? "exists." : "missing. (using generic 404 error)"
    }`,
  );

  fastify.setNotFoundHandler((_req, reply) => {
    if (gatsby404ErrorFileExists) {
      reply.code(404).sendFile("404.html");
    } else {
      reply.code(404).send("Page not found.");
    }
  });
};
