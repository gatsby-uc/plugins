describe(`Test Gatsby Reverse Proxy Routes`, () => {
  it(`Should serve Reverse Proxy route`, async () => {
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
    const response = await fastify.inject({
      url: "/example-proxy-star/*",
      method: "GET",
    });

    expect(response.statusCode).toEqual(404);
  });
});
