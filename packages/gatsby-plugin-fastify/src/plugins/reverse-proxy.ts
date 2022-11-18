import pluginHttpProxy from "@fastify/http-proxy";

import type { FastifyPluginAsync, FastifyReply } from "fastify";
import type { GatsbyFastifyProxy } from "../gatsby/proxies-and-redirects";

// Implements https://support.gatsbsyjs.com/hc/en-us/articles/1500003051241-Working-with-Redirects-and-Rewrites
export const handleReverseProxy: FastifyPluginAsync<{
  proxies: GatsbyFastifyProxy[];
}> = async (fastify, { proxies }) => {
  fastify.log.info(`Registering ${proxies.length} reverse proxy route(s)`);

  for (const proxy of proxies) {
    try {
      // Fastify doesn't not support/require the trailing "*" in the path, so we need to remove if they exist
      const cleanTo = proxy.toPath.replace(/\*$/, "");
      const cleanFrom = proxy.fromPath.replace(/\*$/, "");

      const proxyTo = new URL(cleanTo);

      fastify.log.debug(`Registering "${cleanFrom}" as proxied route to "${cleanTo}".`);

      fastify.register(pluginHttpProxy, {
        upstream: proxyTo.href,
        prefix: cleanFrom,
        replyOptions: {
          onResponse: (_request, reply, response) => {
            (reply as FastifyReply).appendModuleHeader("Reverse Proxy");
            reply.send(response);
          },
        },
      });
    } catch (error) {
      fastify.log.error(error);
    }
  }
};
