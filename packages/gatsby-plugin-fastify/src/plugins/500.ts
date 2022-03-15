import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { resolve } from "path";
import { existsSync } from "fs-extra";
import { PATH_TO_PUBLIC } from "../utils/constants";

export const handle500: FastifyPluginAsync = fp(async (fastify, _opts) => {
  const gatsby500ErrorFileExists = existsSync(resolve(PATH_TO_PUBLIC, "500.html"));
  fastify.log.info(
    `Gatsby 500 error page ${
      gatsby500ErrorFileExists ? "exists" : "missing, using generic 500 error for DSG/SSR"
    }`
  );

  fastify.setErrorHandler(async (err, req, reply) => {
    fastify.log.error(`Error processing ${req.url}, ${err.message}`);
    reply.appendModuleHeader("500");

    if (gatsby500ErrorFileExists) {
      return reply.code(500).sendFile("500.html");
    } else {
      return reply.send("Server Error.");
    }
  });
});
