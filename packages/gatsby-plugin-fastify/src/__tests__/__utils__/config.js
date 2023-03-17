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

  config.server.headers = {
    ...config.server.headers,
    "/component-fake-hash.js": {
      "cache-control": "public, max-age=31536000, immutable",
      "x-test-js": "root js file",
      "x-cache-control": "overwrite cache-control for all root js files",
      "x-test-all-pages": "shows on every page/file",
    },
    "/_gatsby/image/hash/hash/indonesia.jpg": {
      "cache-control": "undefined",
      "x-test-all-pages": "shows on every page/file",
    },
    "/static/hash/hash/icon.png": {
      "cache-control": "public, max-age=31536000, immutable",
      "x-test-all-pages": "shows on every page/file",
    },
    "/fake-lazycomponent.js": {
      "cache-control": "undefined",
      "x-test-all-pages": "shows on every page/file",
    },
  };

  const fastify = Fastify(createFastifyConfig(config));

  await fastify.register(plugin, { prefix: config.server.prefix });
  await fastify.ready();

  return fastify;
}
