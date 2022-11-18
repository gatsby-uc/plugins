import { serveGatsby } from "../../plugins/gatsby";
import { setConfig, getServerConfig, ConfigKeyEnum } from "../../utils/config";
import { createCliConfig, createFastifyInstance } from "./config";

jest.mock("../../utils/constants", () => ({
  ...jest.requireActual("../../utils/constants"),
  PATH_TO_FUNCTIONS: "../../integration-tests/plugin-fastify/.cache/functions/",
  PATH_TO_PUBLIC: "src/__tests__/__files__/public",
  PATH_TO_CACHE: "../../integration-tests/plugin-fastify/.cache",
  CONFIG_FILE_PATH: "../../integration-tests/plugin-fastify/.cache",
}));

export async function setupFastify(options) {
  const overrideServerConfig = options?.overrideServerConfig ?? {};
  setConfig(
    ConfigKeyEnum.CLI,
    createCliConfig({
      port: 3000,
      host: "127.0.0.1",
      logLevel: "fatal",
      open: false,
    })
  );

  setConfig(ConfigKeyEnum.SERVER, { ...getServerConfig(), ...overrideServerConfig });

  return createFastifyInstance(serveGatsby);
}

export async function shutdownFastify(fastify) {
  return fastify.close();
}
