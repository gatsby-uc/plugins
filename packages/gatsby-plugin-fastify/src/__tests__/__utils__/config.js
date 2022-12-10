import Fastify from "fastify";
import { getConfig } from "../../utils/config";
import { createFastifyConfig } from "../../utils/server";

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
  const config = getConfig();

  const fastify = Fastify(createFastifyConfig(config));

  await fastify.register(plugin, { prefix: config.server.prefix });
  await fastify.ready();

  return fastify;
}
