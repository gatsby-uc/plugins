const { serveGatsby } = require("../../plugins/gatsby");

const { ConfigKeyEnum, setConfig, getServerConfig } = require("../../utils/config");

const { createCliConfig, createFastifyInstance } = require("../__utils__/config");

jest.mock("../../utils/constants", () => ({
  ...jest.requireActual("../../utils/constants"),
  PATH_TO_FUNCTIONS: "../../integration-tests/plugin-fastify/.cache/functions/",
  PATH_TO_PUBLIC: "src/__tests__/__files__/public",
  PATH_TO_CACHE: "../../integration-tests/plugin-fastify/.cache",
  CONFIG_FILE_PATH: "../../integration-tests/plugin-fastify/.cache",
}));

describe(`Test Gatsby Reverse Proxy Routes`, () => {
  beforeAll(() => {
    setConfig(
      ConfigKeyEnum.CLI,
      createCliConfig({
        port: 3000,
        host: "127.0.0.1",
        logLevel: "fatal",
        open: false,
      })
    );

    setConfig(ConfigKeyEnum.SERVER, getServerConfig());
  });

  it(`Should serve Reverse Proxy route`, async () => {
    const fastify = await createFastifyInstance(serveGatsby);

    const response = await fastify.inject({
      url: "/example-proxy/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.headers["x-gatsby-fastify"]).toContain("Reverse Proxy");
    expect(response.payload).toContain("Example Domain");
  });

  it(`Should serve Reverse Proxy route made with trailing *`, async () => {
    const fastify = await createFastifyInstance(serveGatsby);

    const response = await fastify.inject({
      url: "/example-proxy-star/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.headers["x-gatsby-fastify"]).toContain("Reverse Proxy");
    expect(response.payload).toContain("Example Domain");
  });

  it(`Should not serve Reverse Proxy route made with trailing * at *`, async () => {
    const fastify = await createFastifyInstance(serveGatsby);

    const response = await fastify.inject({
      url: "/example-proxy-star/*",
      method: "GET",
    });

    expect(response.statusCode).toEqual(404);
  });
});
