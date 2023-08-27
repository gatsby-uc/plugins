import { join } from "node:path";
import { cwd } from "node:process";
import { writeJSON } from "fs-extra";

import { hasFeature } from "gatsby-plugin-utils";

import { CONFIG_FILE_NAME, PATH_TO_CACHE } from "./utils/constants";
import { convertHeaderFormat } from "./utils/headers";

import type { AdapterInit, IAdapter, IAdapterConfig } from "gatsby";
import type { AdapterManifest } from "./utils/config";

interface GatsbyFastifyAdapterOptions {
  cache: IAdapter["cache"];
  deployURL?: IAdapterConfig["deployURL"];
  excludeDatastoreFromEngineFunction?: IAdapterConfig["excludeDatastoreFromEngineFunction"];
}

const createAdapterFastify: AdapterInit<GatsbyFastifyAdapterOptions> = (adapterOptions) => {
  const adapterConfig: IAdapter = {
    name: `gatsby-adapter-fastify`,
    async adapt({ routesManifest, functionsManifest, pathPrefix, trailingSlash, reporter }) {
      if (!hasFeature("adapters")) {
        reporter.panic(
          "You version of Gatsby does not support Adapters, please update to version >=v5.12.0"
        );
      }

      const routes: AdapterManifest["routes"] = {
        static: [],
        dynamic: [],
        redirect: [],
      };

      for (const route of routesManifest) {
        switch (route.type) {
          case "function": {
            routes.dynamic.push(route);
            break;
          }
          case "redirect": {
            routes.redirect.push({ ...route, headers: convertHeaderFormat(route.headers) });
            break;
          }
          case "static": {
            routes.static.push({ ...route, headers: convertHeaderFormat(route.headers) });
            break;
          }
          default: {
            //@ts-expect-error - Not possible based on types but including incase Gatsby changes something.
            reporter.warn(`Unknown route type: ${route.type} - please report this issue`);
          }
        }
      }

      const fastifyServerConfig: AdapterManifest = {
        routes,
        functionsManifest,
        pathPrefix,
        trailingSlash,
      };

      await writeJSON(join(cwd(), PATH_TO_CACHE, CONFIG_FILE_NAME), fastifyServerConfig, {
        spaces: 2,
      });
    },
    config({ reporter }) {
      const config: IAdapterConfig = {
        supports: {
          pathPrefix: true,
          trailingSlash: ["ignore"], /// always, never, ignore
        },
        pluginsToDisable: ["gatsby-plugin-fastify"],
      };

      if (adapterOptions?.excludeDatastoreFromEngineFunction) {
        reporter.verbose(`Excluding Database Store from Engine Function as Requested`);

        if (!adapterOptions.deployURL) {
          reporter.panic(
            "Excluding Database requiers the `deployURL` to be passed to the adapter options"
          );
        }
        config.excludeDatastoreFromEngineFunction =
          adapterOptions.excludeDatastoreFromEngineFunction;
      }

      if (adapterOptions?.deployURL) {
        reporter.verbose(`Using provided Deploy URL: ${adapterOptions.deployURL}`);
        config.deployURL = adapterOptions.deployURL;
      }

      return config;
    },
  };

  if (adapterOptions?.cache) {
    adapterConfig.cache = adapterOptions.cache;
  }

  return adapterConfig;
};

export default createAdapterFastify;
