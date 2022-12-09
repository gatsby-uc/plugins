describe(`Client Side Routes`, () => {
  it(`Should handle base route`, async () => {
    const response = await fastify.inject({
      url: "/app/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.payload).toMatchSnapshot();
  });

  it(`Should handle sub routes`, async () => {
    const responseBase = await fastify.inject({
      url: "/app/",
      method: "GET",
    });

    const response = await fastify.inject({
      url: "/app/subPath/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.payload).toMatchSnapshot();
    expect(response.payload).toEqual(responseBase.payload);
  });

  it(`Should redirect on sub routes for trailingSlash`, async () => {
    const response = await fastify.inject({
      url: "/app/subPath",
      method: "GET",
    });

    expect(response.statusCode).toEqual(301);
    expect(response.headers["location"]).toEqual("/app/subPath/");
  });
});
