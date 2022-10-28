import { StatusCodes } from "http-status-codes";

describe(`Gatsby Redirects`, () => {
  it(`Should handle permanent redirect`, async () => {
    const response = await fastify.inject({
      url: "/perm-redirect",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_PERMANENTLY);
    expect(response.headers.location).toEqual("/posts/page-1");
  });

  it(`Should handle temporary redirect`, async () => {
    const response = await fastify.inject({
      url: "/temp-redirect",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/posts/page-2");
  });

  it(`Should handle alt redirect`, async () => {
    const response = await fastify.inject({
      url: "/alt-redirect",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.TEMPORARY_REDIRECT);
    expect(response.headers.location).toEqual("/posts/page-3");
  });

  it(`Should handle redirect with path params`, async () => {
    const response = await fastify.inject({
      url: "/redirect/a",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/app/a");
  });

  it(`Should handle redirect with query string to params`, async () => {
    const response = await fastify.inject({
      url: "/redirect-query?letter=a",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/app/a");
  });

  it(`Should handle redirect with query string to other query params`, async () => {
    const response = await fastify.inject({
      url: "/redirect-query-query?letter=a",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/app?letter=a");
  });

  it(`Should handle redirect with catch all`, async () => {
    const response = await fastify.inject({
      url: "/redirect-all/a",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/app/a");
  });

  it(`Should handle redirect with catch all to 1 location`, async () => {
    const response = await fastify.inject({
      url: "/redirect-all2/a",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/app/");
  });

  it(`Should handle redirect correctly with params and catch all`, async () => {
    const response = await fastify.inject({
      url: "/redirect-weird/test/more-stuff",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/app/test/more-stuff");
  });

  it(`Should handle redirect correctly with specific query strings`, async () => {
    const response = await fastify.inject({
      url: "/redirect-query-specific?id=2",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.MOVED_TEMPORARILY);
    expect(response.headers.location).toEqual("/file2.pdf");
  });
});
