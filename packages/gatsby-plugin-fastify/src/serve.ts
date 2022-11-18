/* eslint unicorn/no-process-exit: "off" */
import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils/config";

export async function gatsbyServer() {
  const {
    cli: { port, host, logLevel },
    server: { prefix },
  } = getConfig();

  const fastify = Fastify({
    maxParamLength: 500,
    ignoreTrailingSlash: true,
    logger: {
      level: logLevel,
      transport:
        process.env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  });

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
