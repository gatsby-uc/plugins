const { gatsbyServer } = require("../../serve");
const { ConfigKeyEnum, setConfig, getServerConfig, getConfig } = require("../../utils/config");

jest.mock("../../utils/constants", () => ({
  ...jest.requireActual("../../utils/constants"),
  PATH_TO_FUNCTIONS: "test-site/.cache/functions/",
  PATH_TO_PUBLIC: __dirname + "/../__files__/public/",
  PATH_TO_CACHE: "test-site/.cache/",
  CONFIG_FILE_PATH: __dirname + "../../../../test-site/.cache/",
}));

function createCliConfig({ host, port, logLevel, open }) {
  return {
    host,
    h: host,
    port,
    p: port,
    logLevel,
    l: logLevel,
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

      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/test/",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();

      setConfig(ConfigKeyEnum.SERVER, defaultconfig);
    });
  });

  describe(`Gatsby Static Routes`, () => {
    it(`Should serve custom 404`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/badRoute",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(404);
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should serve static index route`, async () => {
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

  describe(`Gatsby Functions`, () => {
    it(`Should serve function route`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/api/test",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(200);
      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should serve function splat route`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/api/splat/doesThisWork",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(200);
      expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should 404 on bad function route`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/api/badRoute",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(404);
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe(`Gatsby Redirects`, () => {
    it(`Should handle permanent redirect`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/perm-redirect",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(301);
      expect(response.headers.location).toEqual("/posts/page-1");
    });

    it(`Should handle temporary redirect`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/temp-redirect",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(302);
      expect(response.headers.location).toEqual("/posts/page-2");
    });

    it(`Should handle alt redirect`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/alt-redirect",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(307);
      expect(response.headers.location).toEqual("/posts/page-3");
    });
  });

  describe(`Client Side Routes`, () => {
    it(`Should handle base route`, async () => {
      const fastify = await gatsbyServer();

      const response = await fastify.inject({
        url: "/app/",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();
    });

    it(`Should handle sub routes`, async () => {
      const fastify = await gatsbyServer();

      const responseBase = await fastify.inject({
        url: "/app/",
        method: "GET",
      });

      const response = await fastify.inject({
        url: "/app/subPath",
        method: "GET",
      });

      await fastify.close();

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();
      expect(responseBase.payload).toEqual(response.payload);
    });
  });
});
