import type { FastifyReply } from "fastify";
import type { IHeader } from "gatsby/dist/redux/types";
import { IHeadersFastify } from "./config";

function appendHeader({ name, value }: { name: string; value: string }, reply: FastifyReply): void {
  const existingHeader = reply.getHeader(name);
  if (existingHeader) {
    reply.header(name, `${existingHeader} ${value.endsWith(";") ? value : value + ";"}`);
  } else {
    reply.header(name, value);
  }
}

export type Modules = "Static" | "Dynamic" | "Redirects" | "404" | "500";

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

// TODO: remove if confirmened not needed
// export function setHeaderDecorator(this: FastifyReply, key: string, value: string) {
//   this.header(key, value);
// }

//NEW
export function convertHeaderFormat(headers: IHeader["headers"]): IHeadersFastify {
  const newHeaders = {};

  for (const header of headers) {
    newHeaders[header.key] = header.value;
  }
  return newHeaders;
}
