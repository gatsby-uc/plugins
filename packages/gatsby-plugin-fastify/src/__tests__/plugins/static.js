describe(`Gatsby Static Routes`, () => {
  it(`Should serve custom 404`, async () => {
    const response = await fastify.inject({
      url: "/badRoute",
      method: "GET",
    });

    expect(response.statusCode).toEqual(404);
    expect(response.payload).toMatchSnapshot();
  });

  it(`Should serve static index route`, async () => {
    const response = await fastify.inject({
      url: "/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.payload).toMatchSnapshot();
  });

  it(`Should serve static route with or without trailing /`, async () => {
    const noSlashResponse = await fastify.inject({
      url: "/posts/page-1",
      method: "GET",
    });

    const slashResponse = await fastify.inject({
      url: "/posts/page-1/",
      method: "GET",
    });

    expect(noSlashResponse.statusCode).toEqual(200);
    expect(slashResponse.statusCode).toEqual(200);
    expect(noSlashResponse.payload).toEqual(slashResponse.payload);
  });
});
