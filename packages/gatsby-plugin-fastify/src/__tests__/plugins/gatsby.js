import { setupFastify, shutdownFastify } from "../__utils__/server";

describe(`Test Gatsby Server`, () => {
  let fastify;
  beforeAll(async () => {
    fastify = await setupFastify({ overrideServerConfig: { prefix: "/test" } });
  });

  afterAll(async () => {
    await shutdownFastify(fastify);
  });

  describe(`Gatsby Path Prefix`, () => {
    it(`Should be served at prefix`, async () => {
      const response = await fastify.inject({
        url: "/test/",
        method: "GET",
      });

      expect(response.statusCode).toEqual(200);
      expect(response.payload).toMatchSnapshot();
    });
  });
});
