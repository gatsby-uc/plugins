import { IRedirect } from "gatsby/dist/redux/types";
import { FastifyPluginAsync } from "fastify";

export function getResponseCode(redirect: IRedirect): HttpRedirectCodes {
  return (
    redirect.statusCode ||
    (redirect.isPermanent ? HttpRedirectCodes.MovedPermanently : HttpRedirectCodes.Found)
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
enum HttpRedirectCodes {
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  SwitchProxy = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
}
