import { join } from "node:path";
import { readJSONSync, existsSync } from "fs-extra";

// import type { FastifyServerOptions } from "fastify";
import type { FunctionsManifest, IStaticRoute, IFunctionRoute, IRedirectRoute } from "gatsby";
import type { TrailingSlash } from "gatsby-page-utils";
import { CONFIG_FILE_NAME, CONFIG_FILE_PATH } from "./constants";

let config: Partial<GfConfig> = {};

export interface IHeadersFastify {
  [key: string]: string;
}

export interface StaticRoute extends Omit<IStaticRoute, "headers"> {
  headers: IHeadersFastify;
}

export interface RedirectRoute extends Omit<IRedirectRoute, "headers"> {
  headers: IHeadersFastify;
}

export interface AdapterManifest {
  routes: {
    static: StaticRoute[];
    dynamic: IFunctionRoute[];
    redirect: RedirectRoute[];
  };
  functionsManifest: FunctionsManifest;
  /**
   * @see https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/#pathprefix
   */
  pathPrefix: string;
  /**
   * @see https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/#trailingslash
   */
  trailingSlash: TrailingSlash;
}

/**
 * Saved for later to create a fastify.config.js file to allow passing functions for the logger and such. 
 *   fastify?: {
    maxParamLength: FastifyServerOptions["maxParamLength"];
    caseSensitive: FastifyServerOptions["caseSensitive"];
    logger: FastifyServerOptions["logger"];
  };
 */

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
  [ConfigKeyEnum.SERVER]: AdapterManifest;
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

export function getServerConfig(): AdapterManifest {
  const configPath = join(CONFIG_FILE_PATH, CONFIG_FILE_NAME);
  if (!existsSync(configPath)) {
    throw new Error(
      `No Server config found @ ${configPath}, did you do a production Gatsby Build?`
    );
  }
  return readJSONSync(configPath, { encoding: "utf8" });
}
