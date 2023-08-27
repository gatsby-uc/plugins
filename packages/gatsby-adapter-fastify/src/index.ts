import { join } from "node:path";
import { cwd } from "node:process";
import { writeJSON } from "fs-extra";

import { hasFeature } from "gatsby-plugin-utils";

import { CONFIG_FILE_NAME, PATH_TO_CACHE } from "./utils/constants";

import type { AdapterInit, IAdapter, IAdapterConfig } from "gatsby";
import type { GatsbyFastifyAdapterOptions } from "./utils/config";

const createAdapterFastify: AdapterInit<GatsbyFastifyAdapterOptions> = (adapterOptions) => {
  const adapterConfig: IAdapter = {
    name: `gatsby-adapter-fastify`,
    async adapt({ routesManifest, functionsManifest, pathPrefix, trailingSlash, reporter }) {
      if (!hasFeature("adapters")) {
        reporter.panic(
          "You version of Gatsby does not support Adapters, please update to version >=v5.12.0"
        );
      }

      reporter.info("Adapting Gatsby to be server with Fastify!");

      const fastifyServerConfig = {
        routesManifest,
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
