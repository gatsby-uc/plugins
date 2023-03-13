import fp from "fastify-plugin";
import { isMatch } from "picomatch";
import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { getConfig } from "../utils/config";
import { NEVER_CACHE_HEADER } from "../utils/constants";

export const handleHeaders: FastifyPluginAsync = fp(async (fastify) => {
  fastify.addHook("onSend", async function (request, reply: FastifyReply) {
    // add all necessary headers
    const {
      server: {
        headers,
        features: {
          headers: { useDefaultCaching },
        },
      },
    } = getConfig();

    // get the url without query params
    const url = request.raw.url?.split(`?`)[0];

    // handle directory URLs which resolve to index.html
    if (
      useDefaultCaching &&
      (url?.endsWith("/") || // directories with trailing slash
        (!url?.includes(".") && !url?.endsWith("/"))) // no trailing slash or file extension, so it's a directory
    ) {
      reply.headers(NEVER_CACHE_HEADER);
    }

    // handle pattern match caching
    for (const [pattern, headerObject] of Object.entries(headers)) {
      if (url && isMatch(url, pattern)) {
        // set configured headers
        reply.headers(headerObject);

        // overwrite configured headers with SSR values
        if (reply.pageQueryData?.serverDataHeaders) {
          reply.headers(reply.pageQueryData.serverDataHeaders);
        }
      }
    }
  });
});
