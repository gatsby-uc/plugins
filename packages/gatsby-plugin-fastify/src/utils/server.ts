import type { FastifyServerOptions } from "fastify";
import type { GfConfig } from "./config";

export function createFastifyConfig(config: GfConfig): FastifyServerOptions {
  const {
    cli: { logLevel },
    server: { fastify: userOptions },
  } = config;

  return {
    logger: { level: logLevel },
    maxParamLength: 500,
    ...userOptions,
    ignoreTrailingSlash: false,
  };
}
