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
    server: { fastify: fastifyOptions },
  } = getConfig();
  const fastify = Fastify({
    ...fastifyOptions,
    ignoreTrailingSlash: true,
  });

  const {
    server: { prefix },
  } = getConfig();
  await fastify.register(plugin, { prefix });
  await fastify.ready();

  return fastify;
}
