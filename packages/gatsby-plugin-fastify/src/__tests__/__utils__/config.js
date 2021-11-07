import Fastify from "fastify";
import { getConfig } from "../../utils/config";

exports.createCliConfig = function createCliConfig({ host, port, logLevel, open }) {
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
};

exports.createFastifyInstance = async function createFastifyInstance(plugin) {
  const {
    cli: { logLevel },
  } = getConfig();
  const fastify = Fastify({
    ignoreTrailingSlash: true,
    logger: { level: logLevel, prettyPrint: true },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  });

  const {
    server: { prefix },
  } = getConfig();
  await fastify.register(plugin, { prefix });
  await fastify.ready();

  return fastify;
};
