import type { FastifyServerOptions } from "fastify";
import { Server } from "node:http";
import type { GfConfig } from "./config";

export function createFastifyConfig(config: GfConfig): FastifyServerOptions {
  return {
    logger: { level: config.cli.logLevel },
    maxParamLength: 500,
    ...config.server.fastify,
    ignoreTrailingSlash: false,
  };
}
