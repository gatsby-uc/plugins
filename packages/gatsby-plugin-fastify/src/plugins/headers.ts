import fp from "fastify-plugin";

import { SECURITY_HEADERS } from "../utils/constants";
import { removeQueryParmsFromUrl } from "../utils/routes";

import type { Headers } from "../utils/headers";
import type { FastifyPluginAsync, FastifyReply } from "fastify";

export const handleHeaders: FastifyPluginAsync<{
  headers: Headers;
  useDefaultSecurity: boolean;
}> = fp(async (fastify, { headers, useDefaultSecurity }) => {
  fastify.addHook("onSend", async function (request, reply: FastifyReply) {
    let pageHeaders = {};
    const useServerHeaders = ["FUNCTION", "SSR", "PROXY"].includes(reply.mode);
    const serverHeaders = useServerHeaders ? reply.getHeaders() : {};

    // apply default security headers here instead of header-builder to
    // prevent duplication on every page/file entry in the postbuild config
    if (useDefaultSecurity) pageHeaders = { ...SECURITY_HEADERS["/**"] };

    // get the url without query params
    const workingURL = removeQueryParmsFromUrl(request.url);
    const urlHeaders = headers[workingURL];
    if (urlHeaders) pageHeaders = { ...pageHeaders, ...urlHeaders };

    // handle special path type routes
    if (["CSR", "SSR", "REDIRECT", "FUNCTION", "PROXY", "404", "500"].includes(reply.mode)) {
      const pathHeaders = headers[reply.path];
      if (pathHeaders) pageHeaders = { ...pageHeaders, ...pathHeaders };
    }

    // add configured headers
    reply.headers(pageHeaders);

    // check pageHeaders for "undefined" values and remove those headers
    for (const [header, value] of Object.entries(pageHeaders)) {
      if (value === "undefined") {
        reply.removeHeader(header);
      }
    }

    // all headers set in server handlers to overwrite duplicate previously configured headers
    if (useServerHeaders) reply.headers(serverHeaders);
  });
});
