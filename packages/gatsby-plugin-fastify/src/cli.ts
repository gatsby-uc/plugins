#!/usr/bin/env node

import { setConfig, ConfigKeyEnum, getServerConfig } from "./utils";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { gatsbyServer } from "./serve";

yargs(hideBin(process.argv))
  .options({
    v: {
      alias: "verbose",
      default: false,
      type: "boolean",
      describe: "Show verbose output",
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
  })
  .env("GATSBY_SERVER_")
  .command(
    "$0",
    "Serve the Gatsby Site",
    (_yargs) => {},
    (argv) => {
      setConfig(ConfigKeyEnum.CLI, argv as any);
      setConfig(ConfigKeyEnum.SERVER, getServerConfig());

      gatsbyServer();
    },
  ).argv;
