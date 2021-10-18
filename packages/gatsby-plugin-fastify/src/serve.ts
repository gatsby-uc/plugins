import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils/config";

export async function gatsbyServer() {
  const {
    cli: { port, host },
    server: { prefix },
  } = getConfig();

  const fastify = Fastify({
    ignoreTrailingSlash: true,
    logger: { level: "info", prettyPrint: true },
    disableRequestLogging: true,
  });

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
