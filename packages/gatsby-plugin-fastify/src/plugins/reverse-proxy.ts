import pluginHttpProxy from "@fastify/http-proxy";
import pluginReplyFrom from "@fastify/reply-from";

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
      const wildcard = proxy.fromPath.endsWith("*");
      const cleanTo = proxy.toPath.replace(/\*$/, "");
      const cleanFrom = proxy.fromPath.replace(/\/\*$/, ""); // Remove trailing slash if it exists

      const proxyTo = new URL(cleanTo);

      fastify.log.debug(`Registering "${cleanFrom}" as proxied route to "${cleanTo}".`);
      if (wildcard) {
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
      } else {
        fastify.register(pluginReplyFrom, {
          base: proxyTo.href,
        });
        fastify.get(cleanFrom, (_request, reply) => {
          (reply as FastifyReply).appendModuleHeader("Reverse Proxy");
          reply.from(cleanTo);
        });
      }
    } catch (error) {
      fastify.log.error(error);
    }
  }
};
