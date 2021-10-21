import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils/config";

export async function gatsbyServer() {
  const {
    cli: { port, host, logLevel },
    server: { prefix },
  } = getConfig();

  const fastify = Fastify({
    ignoreTrailingSlash: true,
    logger: { level: logLevel, prettyPrint: true },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  });

  fastify.log.info(`Logging Level set @ ${logLevel}`);
  fastify.log.info(`Mounting Gatsby @ ${prefix || "/"}`);

  try {
    await fastify.register(serveGatsby, { prefix });

    await fastify.listen(port, host);
  } catch (err) {
    fastify.log.fatal("Failed to start Fastify", err);
    process.exit(1);
  }

  return fastify;
}
