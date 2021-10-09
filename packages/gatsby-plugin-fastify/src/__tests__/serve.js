const { gatsbyServer } = require("../serve");
const { ConfigKeyEnum, setConfig } = require("../utils/config");

jest.mock("../utils/constants", () => ({
  PATH_TO_PUBLIC: __dirname + "/public/",
}));

function createCliConfig({ host, port, verbose, open }) {
  return {
    host,
    h: host,
    port,
    p: port,
    verbose,
    v: verbose,
    open,
    o: open,
  };
}

describe(`Test Gatsby Server`, () => {
  beforeAll(() => {
    setConfig(
      ConfigKeyEnum.CLI,
      createCliConfig({
        port: 3000,
        host: "127.0.0.1",
        verbose: false,
        open: false,
      }),
    );

    setConfig(ConfigKeyEnum.SERVER, {
      clientSideRoutes: [],
      redirects: [],
      prefix: "",
      functions: [],
    });
  });

  it(`Should 404`, async () => {
    setConfig(ConfigKeyEnum.SERVER, {
      clientSideRoutes: [],
      redirects: [],
      prefix: "",
      functions: [],
    });

    const fastify = await gatsbyServer();

    const response = await fastify.inject({
      url: "/badRoute",
      method: "GET",
    });

    await fastify.close();

    expect(response.statusCode).toEqual(404);
  });

  it(`Should work`, async () => {
    const fastify = await gatsbyServer();

    const response = await fastify.inject({
      url: "/",
      method: "GET",
    });

    await fastify.close();

    expect(response.statusCode).toEqual(200);
    expect(response.payload).toMatchSnapshot();
  });
});
