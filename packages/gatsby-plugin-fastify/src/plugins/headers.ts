import fp from "fastify-plugin";
import { isMatch } from "picomatch";

import { NEVER_CACHE_HEADER } from "../utils/constants";
import { removeQueryParmsFromUrl } from "../utils/routes";

import type { Headers } from "../utils/headers";
import type { FastifyPluginAsync, FastifyReply } from "fastify";

export const handleHeaders: FastifyPluginAsync<{
  headers: Headers;
  useDefaultCaching: boolean;
}> = fp(async (fastify, { headers, useDefaultCaching }) => {
  fastify.addHook("onSend", async function (request, reply: FastifyReply) {
    // get the url without query params
    const workingURL = removeQueryParmsFromUrl(request.url);

    // handle directory URLs which resolve to index.html
    if (
      useDefaultCaching &&
      (workingURL?.endsWith("/") || // directories with trailing slash
        (!workingURL?.includes(".") && !workingURL?.endsWith("/"))) // no trailing slash or file extension, so it's a directory
    ) {
      reply.headers(NEVER_CACHE_HEADER);
    }

    // handle pattern match caching
    if (workingURL) {
      for (const [pattern, headerObject] of Object.entries(headers)) {
        if (isMatch(workingURL, pattern)) {
          // set configured headers
          reply.headers(headerObject);

          // check headerObject for "undefined" values and remove those headers
          for (const [header, value] of Object.entries(headerObject)) {
            if (value === "undefined") {
              reply.removeHeader(header);
            }
          }

          // allow serverDataHeaders to override duplicate configured headers
          if (reply.serverDataHeaders) {
            reply.headers(reply.serverDataHeaders);
          }
        }
      }
    }
  });
});
