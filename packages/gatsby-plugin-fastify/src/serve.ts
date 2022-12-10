/* eslint unicorn/no-process-exit: "off" */
import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils/config";
import { createFastifyConfig } from "./utils/server";

export async function gatsbyServer() {
  const {
    cli: { port, host, logLevel },
    server: { prefix },
  } = getConfig();

  const fastify = Fastify(createFastifyConfig(getConfig()));

  fastify.log.info(`Logging Level set @ ${logLevel}`);
  fastify.log.info(`Mounting Gatsby @ ${prefix || "/"}`);

  try {
    await fastify.register(serveGatsby, { prefix });

    await fastify.listen({ port, host });
  } catch (error) {
    console.error(error);
    fastify.log.fatal("Failed to start Fastify");
    process.exit(1);
  }

  return fastify;
}
