import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils/config";

export async function gatsbyServer() {
  const {
    cli: { port, host, logLevel },
    server: { prefix, trailingSlash },
  } = getConfig();

  const fastify = Fastify({
    // This will 200 on either slash or no slash.
    //TODO: Still need to handle /index.html routes
    ignoreTrailingSlash: trailingSlash === "ignore" || trailingSlash === "legacy" ? true : false,
    logger: { level: logLevel, prettyPrint: true },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  });

  fastify.log.info(`Logging Level set @ ${logLevel}`);
  fastify.log.info(`Mounting Gatsby @ ${prefix || "/"}`);

  try {
    await fastify.register(serveGatsby, { prefix });

    await fastify.listen(port, host);
  } catch (err) {
    console.error(err);
    fastify.log.fatal("Failed to start Fastify");
    process.exit(1);
  }

  return fastify;
}
