import fp from "fastify-plugin";

import { moduleHeaderDecorator, setHeaderDecorator } from "../utils/headers";

import type { FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyReply {
    appendModuleHeader: typeof moduleHeaderDecorator;
    setHeader: FastifyReply["header"];
  }
}

export const implementUtilDecorators: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateReply("setHeader", setHeaderDecorator);
  fastify.decorateReply("appendModuleHeader", moduleHeaderDecorator, ["setHeader"]);
});
