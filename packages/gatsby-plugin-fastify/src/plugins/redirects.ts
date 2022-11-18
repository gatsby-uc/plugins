import { StatusCodes } from "http-status-codes";

import { removeQueryParmsFromUrl, buildRedirectUrlFromParameters } from "../utils/routes";

import type { FastifyPluginAsync } from "fastify";
import type { IRedirect } from "gatsby/dist/redux/types";

function getResponseCode(redirect: IRedirect): StatusCodes {
  return (
    redirect.statusCode ||
    (redirect.isPermanent ? StatusCodes.PERMANENT_REDIRECT : StatusCodes.TEMPORARY_REDIRECT)
  );
}

export const handleRedirects: FastifyPluginAsync<{
  redirects: IRedirect[];
}> = async (fastify, { redirects }) => {
  fastify.log.info(`Registering ${redirects.length} redirect(s)`);

  const queryStringHandlers: {
    [s: string]: IRedirect;
  } = {};

  const alreadyRegisterd = new Set();

  for (let redirect of redirects) {
    let responseCode = getResponseCode(redirect);
    fastify.log.debug(
      `Registering "${redirect.fromPath}" as redirect to "${redirect.toPath}" with HTTP status code "${responseCode}".`
    );

    /* Fastify can't register routes currently with the query stirngs in the path.
     *  We must strip these out and only register the path once.
     *  We can then check, in that single route, whether the entire url(including the query params) matches a redirect path, if it does
     *
     */
    const cleanFromPath = removeQueryParmsFromUrl(redirect.fromPath);
    const isCleanedPath = cleanFromPath != redirect.fromPath;

    if (isCleanedPath) {
      queryStringHandlers[redirect.fromPath] = redirect;
    }

    if (!alreadyRegisterd.has(cleanFromPath)) {
      isCleanedPath && alreadyRegisterd.add(cleanFromPath);

      fastify.all<{
        Params: {
          [s: string]: string;
        };
        Querystring: {
          [s: string]: string;
        };
      }>(cleanFromPath, { config: {} }, (request, reply) => {
        reply.appendModuleHeader("Redirects");

        if (isCleanedPath && queryStringHandlers[request.url]) {
          redirect = queryStringHandlers[request.url];
          responseCode = getResponseCode(redirect);
        }

        const toUrl = buildRedirectUrlFromParameters(redirect.toPath, {
          ...request.params,
          ...request.query,
        });

        reply.code(responseCode).redirect(toUrl);
      });
    }
  }
};
