import { StatusCodes } from "http-status-codes";

import type { FastifyPluginAsync } from "fastify";
import type { IRedirect } from "gatsby/dist/redux/types";

export function getResponseCode(redirect: IRedirect): StatusCodes {
  return (
    redirect.statusCode ||
    (redirect.isPermanent ? StatusCodes.MOVED_PERMANENTLY : StatusCodes.MOVED_TEMPORARILY)
  );
}

export const handleRedirects: FastifyPluginAsync<{
  redirects: IRedirect[];
}> = async (fastify, { redirects }) => {
  for (const redirect of redirects) {
    const responseCode = getResponseCode(redirect);
    fastify.get(redirect.fromPath, (_req, reply) => {
      reply.code(responseCode).redirect(redirect.toPath);
    });
  }
};
