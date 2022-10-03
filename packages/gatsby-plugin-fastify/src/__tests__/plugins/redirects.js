describe(`Gatsby Redirects`, () => {
  it(`Should handle permanent redirect`, async () => {
    const response = await fastify.inject({
      url: "/perm-redirect",
      method: "GET",
    });

    expect(response.statusCode).toEqual(301);
    expect(response.headers.location).toEqual("/posts/page-1");
  });

  it(`Should handle temporary redirect`, async () => {
    const response = await fastify.inject({
      url: "/temp-redirect",
      method: "GET",
    });

    expect(response.statusCode).toEqual(302);
    expect(response.headers.location).toEqual("/posts/page-2");
  });

  it(`Should handle alt redirect`, async () => {
    const response = await fastify.inject({
      url: "/alt-redirect",
      method: "GET",
    });

    expect(response.statusCode).toEqual(307);
    expect(response.headers.location).toEqual("/posts/page-3");
  });
});
