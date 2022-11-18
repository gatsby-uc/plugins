import type { FastifyReply } from "fastify";

function appendHeader({ name, value }: { name: string; value: string }, reply: FastifyReply): void {
  const existingHeader = reply.getHeader(name);
  if (existingHeader) {
    reply.setHeader(name, `${existingHeader} ${value.endsWith(";") ? value : value + ";"}`);
  } else {
    reply.setHeader(name, value);
  }
}

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

const FG_MODULE_HEADER = "x-gatsby-fastify";

export function appendModuleHeader(module: Modules, reply: FastifyReply): void {
  appendHeader({ name: FG_MODULE_HEADER, value: servedBy(module) }, reply);
}

export function moduleHeaderDecorator(this: FastifyReply, module: Modules): void {
  appendModuleHeader(module, this);
}

export function setHeaderDecorator(this: FastifyReply, key: string, value: string) {
  this.header(key, value);
}
