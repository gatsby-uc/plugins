import path from "path";
import fs from "fs";

import { IRedirect } from "gatsby/dist/redux/types";
import { PathConfig } from "./plugins/clientPaths";
import { GatsbyServerFeatureOptions } from "./plugins/gatsby";

export const CONFIG_FILE_NAME = "gatsby-plugin-node.json";
export const CONFIG_FILE_PATH = "./public";

let config: Partial<GfConfig> = {};

export interface GatsbyNodeServerConfig extends GatsbyServerFeatureOptions {
  paths: PathConfig[];
  redirects: IRedirect[];
  prefix: string | undefined;
}

export type GfCliOptions = {
  port: number;
  p: number;
  host: string;
  h: string;
  open: boolean;
  o: boolean;
  verbose: boolean;
  v: boolean;
};

export type ProgramConfig = {
  directory: string;
};

export enum ConfigKeyEnum {
  CLI = "cli",
  SERVER = "server",
  PROGRAM = "program",
}

export type GfConfig = {
  [ConfigKeyEnum.CLI]: GfCliOptions;
  [ConfigKeyEnum.SERVER]: GatsbyNodeServerConfig;
  [ConfigKeyEnum.PROGRAM]: ProgramConfig;
};

type GetConfigOptions<T> = T extends ConfigKeyEnum.SERVER
  ? GatsbyNodeServerConfig
  : T extends ConfigKeyEnum.CLI
  ? GfCliOptions
  : T extends ConfigKeyEnum.PROGRAM
  ? ProgramConfig
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
  const configPath = path.join(CONFIG_FILE_PATH, CONFIG_FILE_NAME);
  if (!fs.existsSync(configPath)) {
    console.error("Unable to find config @ ", configPath);
    throw Error("No Server config found, did you do a production Gatsby Build?");
  }
  return JSON.parse(fs.readFileSync(configPath, { encoding: "utf8" }));
}
