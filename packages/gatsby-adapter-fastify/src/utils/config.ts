import { readJSONSync, existsSync } from "fs-extra";

import type { IGatsbyFunction, IRedirect } from "gatsby/dist/redux/types";
import type { FastifyServerOptions } from "fastify";
import type { IAdapter, IAdapterConfig } from "gatsby";

import { PathConfig } from "../plugins/client-routes";
import { CONFIG_FILE_NAME, CONFIG_FILE_PATH } from "./constants";
import { buildPrefixer } from "./plugin-data";

let config: Partial<GfConfig> = {};

const configPrefixer = buildPrefixer(CONFIG_FILE_PATH);

export interface GatsbyFastifyAdapterOptions {
  adapter?: {
    cache: IAdapter["cache"];
    deployURL?: IAdapterConfig["deployURL"];
    excludeDatastoreFromEngineFunction?: IAdapterConfig["excludeDatastoreFromEngineFunction"];
  };
  fastify?: {
    maxParamLength: FastifyServerOptions["maxParamLength"];
    caseSensitive: FastifyServerOptions["caseSensitive"];
    logger: FastifyServerOptions["logger"];
  };
}
export interface GatsbyNodeServerManifest extends GatsbyFastifyPluginOptions {
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
