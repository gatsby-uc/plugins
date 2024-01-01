import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils/config";
import { createFastifyConfig } from "./utils/server";

export async function gatsbyServer() {
  const {
    cli: { port, host, logLevel },
    server: { pathPrefix },
  } = getConfig();

  const fastify = Fastify(createFastifyConfig(getConfig()));

  fastify.log.info(`Logging Level set @ ${logLevel}`);
  fastify.log.info(`Mounting Gatsby @ ${pathPrefix || "/"}`);

  try {
    await fastify.register(serveGatsby, { prefix: pathPrefix });

    await fastify.listen({ port, host });
  } catch (error) {
    fastify.log.fatal("Failed to start Fastify");
    throw error;
  }

  return fastify;
}
