import { StatusCodes } from "http-status-codes";

describe(`404 Handler`, () => {
  describe(`trailingSlash = "always"`, () => {
    it(`Client-only App base route should Redirect`, async () => {
      const response = await fastify.inject({
        url: "/app",
        method: "GET",
      });

      expect(response.statusCode).toEqual(StatusCodes.MOVED_PERMANENTLY);
      expect(response.headers["location"]).toEqual("/app/");
    });

    it(`Client-only App sub route should Redirect`, async () => {
      const response = await fastify.inject({
        url: "/app/a",
        method: "GET",
      });

      expect(response.statusCode).toEqual(StatusCodes.MOVED_PERMANENTLY);
      expect(response.headers["location"]).toEqual("/app/a/");
    });

    it(`Static file should Redirect`, async () => {
      const response = await fastify.inject({
        url: "/page/post-1",
        method: "GET",
      });

      expect(response.statusCode).toEqual(StatusCodes.MOVED_PERMANENTLY);
      expect(response.headers["location"]).toEqual("/page/post-1/");
    });

    it(`SSR page should Redirect`, async () => {
      const response = await fastify.inject({
        url: "/ssr",
        method: "GET",
      });

      expect(response.statusCode).toEqual(StatusCodes.MOVED_PERMANENTLY);
      expect(response.headers["location"]).toEqual("/ssr/");
    });

    it(`DSG page should Redirect`, async () => {
      const response = await fastify.inject({
        url: "/generated/page-6",
        method: "GET",
      });

      expect(response.statusCode).toEqual(StatusCodes.MOVED_PERMANENTLY);
      expect(response.headers["location"]).toEqual("/generated/page-6/");
    });
  });
});
