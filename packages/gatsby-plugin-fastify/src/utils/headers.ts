import { isMatch } from "picomatch";
import mapObject from "just-map-object";
import type { FastifyReply } from "fastify";
import { getConfig } from "./config";

function appendHeader({ name, value }: { name: string; value: string }, reply: FastifyReply): void {
  const existingHeader = reply.getHeader(name);
  if (existingHeader) {
    reply.setHeader(name, `${existingHeader} ${value.endsWith(";") ? value : value + ";"}`);
  } else {
    reply.setHeader(name, value);
  }
}

export type HeadersOption = {
  [key: string]: {
    [key: string]: string;
  };
};

export type Modules =
  | "DSG"
  | "SSR"
  | "Static"
  | "Client Route"
  | "Functions"
  | "Redirects"
  | "Reverse Proxy"
  | "404"
  | "500"
  | "Image Transforms";

function servedBy(module: Modules) {
  return `served-by: ${module};`;
}

export const FG_MODULE_HEADER = "x-gatsby-fastify";

export function appendModuleHeader(module: Modules, reply: FastifyReply): void {
  appendHeader({ name: FG_MODULE_HEADER, value: servedBy(module) }, reply);
}

export function moduleHeaderDecorator(this: FastifyReply, module: Modules): void {
  appendModuleHeader(module, this);
}

export function setHeaderDecorator(this: FastifyReply, key: string, value: string) {
  this.header(key, value);
}

export function appendRouteHeaders(route: string, reply: FastifyReply): Record<string, string> {
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
   * @tsdexter: I think we can just use the order of the headers in the
   * config file. Successive matches will with duplicate header `name`'s
   * will overwrite the previous header of the same `name`.
   */
  // console.log(`\n\nheaders`, {headers}, `\n\n`);
  let routeHeaders = {};
  // console.log(`\n\nheaders`, {headers}, `\n\n`);
  mapObject(headers, (pattern, headerObject) => {
    if (isMatch(route, pattern)) {
      // routeHeaders = {...routeHeaders, ...headerObj};
      mapObject(headerObject, (name, value) => {
        reply.setHeader(name, value);
      });
    }
  });
  return routeHeaders;
}
