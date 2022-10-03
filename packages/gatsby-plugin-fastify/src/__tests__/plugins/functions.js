describe(`Gatsby Functions`, () => {
  it(`Should serve function route`, async () => {
    const response = await fastify.inject({
      url: "/api/test",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(response.payload).toMatchSnapshot();
  });

  it(`Should serve function splat route`, async () => {
    const response = await fastify.inject({
      url: "/api/splat/doesThisWork",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toEqual("application/json; charset=utf-8");
    expect(response.payload).toMatchSnapshot();
  });

  it(`Should 404 on bad function route`, async () => {
    const response = await fastify.inject({
      url: "/api/badRoute",
      method: "GET",
    });

    expect(response.statusCode).toEqual(404);
    expect(response.payload).toMatchSnapshot();
  });
});
