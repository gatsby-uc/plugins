import { isMatch } from "picomatch";
import mapObject from "just-map-object";
import type { FastifyReply } from "fastify";

import { getConfig } from "./config";
function appendHeader({ name, value }: { name: string; value: string }, reply: FastifyReply): void {
  const existingHeader = reply.getHeader(name);
  if (existingHeader) {
    reply.header(name, `${existingHeader} ${value.endsWith(";") ? value : value + ";"}`);
  } else {
    reply.header(name, value);
  }
}

type Modules = "DSG" | "SSR" | "Static" | "CSR" | "Functions";

function servedBy(module: Modules) {
  return `served-by: ${module};`;
}

const FG_MODULE_HEADER = "x-gatsby-fastify";

export function appendModuleHeader(module: Modules, reply: FastifyReply): void {
  appendHeader({ name: FG_MODULE_HEADER, value: servedBy(module) }, reply);
}

export function getRouteHeaders(route: string) {
  const {
    server: { headers },
  } = getConfig();

  /**
   * TODO: Solve This
   * If the route is a match for a header, return the header value
   * But how do we prioritize certain matches.
   * How do I make sure that the header is not overwritten by other matches?
   * we expect this but we need a way to prioritize one match over another
   * or am I over complicating this?
   *
   */

  mapObject(headers, (headerRoute, headerValue) => {
    if (isMatch(route, headerRoute)) {
      return header.headers;
    }
  });
}
