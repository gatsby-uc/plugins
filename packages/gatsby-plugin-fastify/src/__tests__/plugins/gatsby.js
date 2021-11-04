const { serveGatsby } = require("../../plugins/gatsby");
const { ConfigKeyEnum, setConfig, getServerConfig, getConfig } = require("../../utils/config");
const Fastify = require("fastify");

const { createCliConfig } = require("../__utils__/config");

console.log(__dirname);
jest.mock("../../utils/constants", () => ({
  ...jest.requireActual("../../utils/constants"),
  PATH_TO_FUNCTIONS: "../../test-sites/fastify/.cache/functions/",
  PATH_TO_PUBLIC: "src/__tests__/__files__/public",
  PATH_TO_CACHE: "../../test-sites/fastify/.cache",
  CONFIG_FILE_PATH: "../../test-sites/fastify/.cache",
}));

async function createFastifyInstance(logLevel = "fatal") {
  const fastify = Fastify({
    ignoreTrailingSlash: true,
    logger: { level: logLevel, prettyPrint: true },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  });

  const {
    server: { prefix },
  } = getConfig();
  await fastify.register(serveGatsby, { prefix });
  await fastify.ready();

  return fastify;
}

const logLevel = "fatal";

describe(`Test Gatsby Server`, () => {
  beforeAll(() => {
    setConfig(
      ConfigKeyEnum.CLI,
      createCliConfig({
        port: 3000,
        host: "127.0.0.1",
        logLevel: "fatal",
        open: false,
      }),
    );

    setConfig(ConfigKeyEnum.SERVER, getServerConfig());
  });

  describe(`Gatsby Path Prefix`, () => {
    it(`Should be served at prefix`, async () => {
      const { server: defaultconfig } = getConfig();
      const newConfig = { ...defaultconfig, prefix: "/test" };
      setConfig(ConfigKeyEnum.SERVER, newConfig);

      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/test/",
        method: "GET",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();

      setConfig(ConfigKeyEnum.SERVER, defaultconfig);
    });
  });

  describe(`Gatsby Static Routes`, () => {
    it(`Should serve custom 404`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/badRoute",
        method: "GET",
      });

      expect(response.statusCode).toEqual(404);
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should serve static index route`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/",
        method: "GET",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should serve static route with or without trailing /`, async () => {
      const fastify = await createFastifyInstance();

      const response1 = await fastify.inject({
        url: "/posts/page-1",
        method: "GET",
      });

      const response2 = await fastify.inject({
        url: "/posts/page-1/",
        method: "GET",
      });

      expect(response1.statusCode).toEqual(response2.statusCode);
      expect(response1.payload).toEqual(response2.payload);
    });
  });

  describe(`Gatsby Functions`, () => {
    it(`Should serve function route`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/api/test",
        method: "GET",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should serve function splat route`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/api/splat/doesThisWork",
        method: "GET",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should 404 on bad function route`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/api/badRoute",
        method: "GET",
      });

      expect(response.statusCode).toEqual(404);
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe(`Gatsby Redirects`, () => {
    it(`Should handle permanent redirect`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/perm-redirect",
        method: "GET",
      });

      expect(response.statusCode).toEqual(301);
      expect(response.headers.location).toEqual("/posts/page-1");
    });

    it(`Should handle temporary redirect`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/temp-redirect",
        method: "GET",
      });

      expect(response.statusCode).toEqual(302);
      expect(response.headers.location).toEqual("/posts/page-2");
    });

    it(`Should handle alt redirect`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/alt-redirect",
        method: "GET",
      });

      expect(response.statusCode).toEqual(307);
      expect(response.headers.location).toEqual("/posts/page-3");
    });
  });

  describe(`Client Side Routes`, () => {
    it(`Should handle base route`, async () => {
      const fastify = await createFastifyInstance();

      const response = await fastify.inject({
        url: "/app/",
        method: "GET",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should handle sub routes`, async () => {
      const fastify = await createFastifyInstance();

      const responseBase = await fastify.inject({
        url: "/app/",
        method: "GET",
      });

      const response = await fastify.inject({
        url: "/app/subPath",
        method: "GET",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();
      expect(responseBase.payload).toEqual(response.payload);
    });
  });
});
