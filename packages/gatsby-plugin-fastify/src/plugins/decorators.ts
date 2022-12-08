import fp from "fastify-plugin";

import { moduleHeaderDecorator, setHeaderDecorator } from "../utils/headers";

import type { FastifyPluginAsync } from "fastify";
import type { TrailingSlash } from "gatsby-page-utils";
import { handleTrailingSlash } from "../utils/routes";

declare module "fastify" {
  interface FastifyReply {
    appendModuleHeader: typeof moduleHeaderDecorator;
    setHeader: FastifyReply["header"];
    handleTrailingSlash: typeof handleTrailingSlash;
  }

  interface FastifyInstance {
    config: {
      trailingSlash: TrailingSlash;
    };
  }
}

export const implementUtilDecorators: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateReply("setHeader", setHeaderDecorator);
  fastify.decorateReply("appendModuleHeader", moduleHeaderDecorator, ["setHeader"]);
  fastify.decorateReply("handleTrailingSlash", handleTrailingSlash);
});

export const implementConfigDecorators: FastifyPluginAsync<{ trailingSlash: TrailingSlash }> = fp(
  async (fastify, { trailingSlash }) => {
    fastify.decorate("config", {
      trailingSlash,
    });
  }
);
