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
  fastify.log.info(`Registering ${redirects.length} redirect(s)`);

  for (const redirect of redirects) {
    const responseCode = getResponseCode(redirect);
    fastify.log.debug(
      `Registering "${redirect.fromPath}" as redirect to "${redirect.toPath}" with HTTP status code "${responseCode}".`
    );

    fastify.get(redirect.fromPath, (_req, reply) => {
      reply.appendModuleHeader("Redirects");

      reply.code(responseCode).redirect(redirect.toPath);
    });
  }
};
