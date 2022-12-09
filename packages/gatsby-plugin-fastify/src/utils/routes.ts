import { FastifyReply } from "fastify";
import { TrailingSlash, applyTrailingSlashOption } from "gatsby-page-utils";
import { StatusCodes } from "http-status-codes";

export function formatMatchPath(matchPath: string, trailingSlash: TrailingSlash): string {
  let path = matchPath
    // /test/*example (named splat route) => /test/* as find-my-way doesn't support named splats
    .replace(/\*([a-z]+)?/i, "*");

  if (trailingSlash !== "always") {
    path = path
      // Findmyway can't match a /example/* route to /example, this modifies the match path is /example* so that it correctly matchs /example, /example/, and /example/test
      // Work around for https://github.com/fastify/fastify/issues/3331
      .replace(/\/\*$/, "*");
  }
  if (trailingSlash === "always") {
    // /test/:param => /test/:param/
    path = path.replace(/(:[a-z]+)\/?/gi, "$1/");
  }

  return path;
}

export function removeQueryParmsFromUrl(url: string) {
  return url.split("?", 2)[0];
}

export function buildRedirectUrlFromParameters(path: string, data: { [s: string]: string } = {}) {
  return path.replace(/:(\w+)|(\*)/gi, function (match, p1, p2) {
    if (p1 && !data[p1]) return match; // :Something in toPath does not have a splat in fromPath pass it through colon intact
    let lookupString = p1 ?? p2;
    let replacement = data[lookupString];

    if (!replacement) {
      throw new Error("Could not find url parameter " + lookupString + " in passed data object");
    }

    return replacement;
  });
}

export function handleGatsbyTrailingSlash(path: string, trailingSlash: TrailingSlash) {
  return applyTrailingSlashOption(path, trailingSlash);
}

export function handleTrailingSlash(this: FastifyReply, url: string, trailingSlash) {
  const potentialTrailingSlashRedirect = handleGatsbyTrailingSlash(url, trailingSlash);

  if (potentialTrailingSlashRedirect !== url) {
    this.redirect(StatusCodes.MOVED_PERMANENTLY, potentialTrailingSlashRedirect);
  }
}
