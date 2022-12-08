import { readJSONSync, existsSync } from "fs-extra";

import type { NoUndefinedField } from "../gatsby/client-side-route";
import type { IGatsbyFunction, IRedirect } from "gatsby/dist/redux/types";
import type { PluginOptions } from "gatsby";
import type { ServerSideRoute } from "../gatsby/server-routes";
import type { GatsbyFastifyProxy } from "../gatsby/proxies-and-redirects";
import type { FastifyServerOptions } from "fastify";

import { PathConfig } from "../plugins/client-routes";
import { CONFIG_FILE_NAME, CONFIG_FILE_PATH } from "./constants";
import { buildPrefixer } from "./plugin-data";

let config: Partial<GfConfig> = {};

const configPrefixer = buildPrefixer(CONFIG_FILE_PATH);

export interface GatsbyFastifyPluginOptions extends PluginOptions {
  features: {
    reverseProxy: boolean | Record<string, unknown>;
    redirects: boolean;
    imageCdn: boolean;
  };
  fastify: FastifyServerOptions;
}
export interface GatsbyNodeServerConfig extends GatsbyFastifyPluginOptions {
  clientSideRoutes: NoUndefinedField<PathConfig>[];
  serverSideRoutes: ServerSideRoute[];
  redirects: IRedirect[];
  prefix: string | undefined;
  functions: IGatsbyFunction[];
  proxies: GatsbyFastifyProxy[];
}

export type GfCliOptions = {
  port: number;
  p: number;
  host: string;
  h: string;
  open: boolean;
  o: boolean;
  logLevel: string;
  l: string;
};

export enum ConfigKeyEnum {
  CLI = "cli",
  SERVER = "server",
}

export type GfConfig = {
  [ConfigKeyEnum.CLI]: GfCliOptions;
  [ConfigKeyEnum.SERVER]: GatsbyNodeServerConfig;
};

export function getConfig(): GfConfig {
  if (config.hasOwnProperty(ConfigKeyEnum.SERVER) && config.hasOwnProperty(ConfigKeyEnum.CLI)) {
    return config as GfConfig;
  }

  throw new Error("Must set config before getting Config.");
}

export function setConfig<Key extends ConfigKeyEnum>(key: Key, incomingConfig: GfConfig[Key]) {
  config[key] = incomingConfig;
}

export function getServerConfig(): GatsbyNodeServerConfig {
  const configPath = configPrefixer(CONFIG_FILE_NAME);
  if (!existsSync(configPath)) {
    throw new Error(
      `No Server config found @ ${configPath}, did you do a production Gatsby Build?`
    );
  }
  return readJSONSync(configPath, { encoding: "utf8" });
}
