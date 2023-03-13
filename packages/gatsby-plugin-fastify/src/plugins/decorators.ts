import fp from "fastify-plugin";

import { moduleHeaderDecorator, setHeaderDecorator } from "../utils/headers";

import type { FastifyPluginAsync } from "fastify";
import type { ISSRData } from "gatsby/dist/utils/page-ssr-module/entry";

declare module "fastify" {
  interface FastifyReply {
    appendModuleHeader: typeof moduleHeaderDecorator;
    setHeader: FastifyReply["header"];
    pageQueryData: ISSRData | null;
  }
}

export const implementUtilDecorators: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateReply("setHeader", setHeaderDecorator);
  fastify.decorateReply("appendModuleHeader", moduleHeaderDecorator, ["setHeader"]);
  // eslint-disable-next-line unicorn/no-null
  fastify.decorateReply("pageQueryData", null);
});
