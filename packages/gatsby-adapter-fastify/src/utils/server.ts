import type { FastifyServerOptions } from "fastify";
import type { GfConfig } from "./config";

export function createFastifyConfig(config: GfConfig): FastifyServerOptions {
  return {
    logger: { level: config.cli.logLevel },
    maxParamLength: 500, // Default from #202 to support Image CDN.
    ...config.server.fastify,
    ignoreTrailingSlash: true, // TODO: update to support `trailingSlash` config from adapter.
  };
}
