import Fastify from "fastify";
import { getConfig } from "../../utils/config";

export function createCliConfig({ host, port, logLevel, open }) {
  return {
    host,
    h: host,
    port,
    p: port,
    logLevel,
    l: logLevel,
    open,
    o: open,
  };
}

export async function createFastifyInstance(plugin) {
  const {
    cli: { logLevel },
  } = getConfig();
  const fastify = Fastify({
    ignoreTrailingSlash: true,
    logger: {
      level: logLevel,
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  });

  const {
    server: { prefix },
  } = getConfig();
  await fastify.register(plugin, { prefix });
  await fastify.ready();

  return fastify;
}
