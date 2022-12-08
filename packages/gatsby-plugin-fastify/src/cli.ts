#!/usr/bin/env node

import { setConfig, ConfigKeyEnum, getServerConfig, getConfig } from "./utils/config";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { gatsbyServer } from "./serve";
import open from "open";

yargs(hideBin(process.argv))
  .env("GATSBY_SERVER_")
  .command(
    "$0",
    "Serve the Gatsby Site",
    (yargs) => {
      return yargs.options({
        l: {
          alias: "logLevel",
          default: "info",
          choices: ["trace", "debug", "info", "warn", "error", "fatal"],
          type: "string",
          describe: "set logging level",
          global: true,
        },
        p: {
          alias: "port",
          default: "8080",
          type: "number",
          describe: "Port to run the server on",
          group: "Server",
        },
        h: {
          alias: "host",
          default: "127.0.0.1",
          type: "string",
          describe: "Host to run the server on",
          group: "Server",
        },
        o: {
          alias: "open",
          default: false,
          type: "boolean",
          describe: "Open the browser",
          group: "Server",
        },
      });
    },
    async (argv) => {
      // @ts-expect-error argv isn't correctly typed by yargs.
      // We're just going to ignore it since it gives us what we need.
      setConfig(ConfigKeyEnum.CLI, argv);
      setConfig(ConfigKeyEnum.SERVER, getServerConfig());

      const {
        server: { prefix },
      } = getConfig();

      await gatsbyServer();

      if (argv.open) {
        const url = `http://${argv.host}:${argv.port}${prefix}`;

        open(url);
      }
    }
  ).argv;
