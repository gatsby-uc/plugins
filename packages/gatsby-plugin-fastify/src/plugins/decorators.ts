import fp from "fastify-plugin";

import { moduleHeaderDecorator, setHeaderDecorator } from "../utils/headers";

import type { FastifyPluginAsync } from "fastify";
import { Page } from "../gatsby/header-builder";

declare module "fastify" {
  interface FastifyReply {
    appendModuleHeader: typeof moduleHeaderDecorator;
    setHeader: FastifyReply["header"];
    mode: Page["mode"] | "";
    path: string;
  }
}

export const implementUtilDecorators: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateReply("setHeader", setHeaderDecorator);
  fastify.decorateReply("appendModuleHeader", moduleHeaderDecorator, ["setHeader"]);
  fastify.addHook("onRequest", async (_request, reply) => {
    reply.mode = "";
    reply.path = "";
  });
});
