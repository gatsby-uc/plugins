import pluginHttpProxy from "fastify-http-proxy";

import type { FastifyPluginAsync } from "fastify";
import type { GatsbyFastifyProxy } from "../gatsby/proxiesAndRedirects";

// Implements https://support.gatsbsyjs.com/hc/en-us/articles/1500003051241-Working-with-Redirects-and-Rewrites
export const handleReverseProxy: FastifyPluginAsync<{
  proxies: GatsbyFastifyProxy[];
}> = async (fastify, { proxies }) => {
  fastify.log.info(`Registering ${proxies.length} reverse proxy route(s)`);

  for (const proxy of proxies) {
    try {
      const proxyTo = new URL(proxy.toPath);
      fastify.log.debug(`Registering "${proxy.fromPath}" as proxied route to "${proxy.toPath}".`);

      fastify.register(pluginHttpProxy, {
        upstream: proxyTo.href,
        prefix: proxy.fromPath,
        replyOptions: {
          onResponse: (_req, reply, res) => {
            reply.header("x-gatsby-fastify", "served-by: reverse-proxy-handler");
            reply.send(res);
          },
        },
      });
    } catch (e) {
      fastify.log.error(e);
    }
  }
};
