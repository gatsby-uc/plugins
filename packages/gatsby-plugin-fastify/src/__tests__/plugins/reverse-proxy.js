import { FG_MODULE_HEADER } from "../../utils/headers";

describe(`Test Gatsby Reverse Proxy Routes`, () => {
  it(`Should serve specific Reverse Proxy route with or without trailing slash`, async () => {
    const response = await fastify.inject({
      url: "/example-proxy/",
      method: "GET",
    });
    const response2 = await fastify.inject({
      url: "/example-proxy",
      method: "GET",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.headers[FG_MODULE_HEADER]).toContain("Reverse Proxy");
    expect(response.payload).toContain("Example Domain");
    expect(response2.statusCode).toEqual(200);
    expect(response2.headers["content-type"]).toContain("text/html");
    expect(response2.headers[FG_MODULE_HEADER]).toContain("Reverse Proxy");
    expect(response2.payload).toContain("Example Domain");
  });

  it(`Should serve specific Reverse Proxy only at the specified route`, async () => {
    const response = await fastify.inject({
      url: "/example-proxy-anything-else",
      method: "GET",
    });
    const response2 = await fastify.inject({
      url: "/example-proxy/anything-else",
      method: "GET",
    });

    expect(response.statusCode).toEqual(404);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.headers[FG_MODULE_HEADER]).toContain("404");
    expect(response.payload).toContain("Gatsby Plugin Fastify");
    expect(response2.statusCode).toEqual(404);
    expect(response2.headers["content-type"]).toContain("text/html");
    expect(response2.headers[FG_MODULE_HEADER]).toContain("404");
    expect(response2.payload).toContain("Gatsby Plugin Fastify");
  });

  it(`Should serve Reverse Proxy route made with trailing * with or without trailing slash`, async () => {
    const response = await fastify.inject({
      url: "/example-proxy-star/",
      method: "GET",
    });
    const response2 = await fastify.inject({
      url: "/example-proxy-star",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.headers[FG_MODULE_HEADER]).toContain("Reverse Proxy");
    expect(response.payload).toContain("Example Domain");
    expect(response2.statusCode).toEqual(200);
    expect(response2.headers["content-type"]).toContain("text/html");
    expect(response2.headers[FG_MODULE_HEADER]).toContain("Reverse Proxy");
    expect(response2.payload).toContain("Example Domain");
  });

  it(`Should serve wildcard Reverse Proxy routes via proxied server`, async () => {
    const response = await fastify.inject({
      url: "/example-proxy-star/anything-else",
      method: "GET",
    });

    expect(response.statusCode).toEqual(404);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.headers[FG_MODULE_HEADER]).toContain("Reverse Proxy");
    expect(response.payload).toContain("Example Domain");
  });
});
