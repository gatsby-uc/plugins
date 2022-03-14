import { readJSONSync, existsSync } from "fs-extra";

import type { NoUndefinedField } from "../gatsby/clientSideRoutes";
import type { IGatsbyFunction, IRedirect } from "gatsby/dist/redux/types";
import type { PluginOptions } from "gatsby";
import type { ServerSideRoute } from "../gatsby/serverRoutes";
import type { GatsbyFastifyProxy } from "../gatsby/proxiesAndRedirects";

import { PathConfig } from "../plugins/clientRoutes";
import { CONFIG_FILE_NAME, CONFIG_FILE_PATH } from "./constants";
import { buildPrefixer } from "./plugin-data";

let config: Partial<GfConfig> = {};

const configPrefixer = buildPrefixer(CONFIG_FILE_PATH);

export interface GatsbyNodeServerConfig extends PluginOptions {
  clientSideRoutes: NoUndefinedField<PathConfig>[];
  serverSideRoutes: ServerSideRoute[];
  redirects: IRedirect[];
  prefix: string | undefined;
  functions: IGatsbyFunction[];
  proxies: GatsbyFastifyProxy[];
  features: {
    reverseProxy: boolean | {};
  };
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

type GetConfigOptions<T> = T extends ConfigKeyEnum.SERVER
  ? GatsbyNodeServerConfig
  : T extends ConfigKeyEnum.CLI
  ? GfCliOptions
  : never;

export function getConfig(): GfConfig {
  if (config.hasOwnProperty(ConfigKeyEnum.SERVER) && config.hasOwnProperty(ConfigKeyEnum.CLI)) {
    return config as GfConfig;
  }

  throw new Error("Must set config before getting Config.");
}

export function setConfig(key: ConfigKeyEnum, incomingConfig: GetConfigOptions<ConfigKeyEnum>) {
  //@ts-ignore
  config[key] = incomingConfig;
}

export function getServerConfig(): GatsbyNodeServerConfig {
  const configPath = configPrefixer(CONFIG_FILE_NAME);
  if (!existsSync(configPath)) {
    throw Error(`No Server config found @ ${configPath}, did you do a production Gatsby Build?`);
  }
  return readJSONSync(configPath, { encoding: "utf8" });
}
