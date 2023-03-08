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

  // test to check that /posts/page-1 contains x-test-page-specific header
  it(`cache headers can be added to specific pages`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-1",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("x-test-page-specific");
  });

  // should not contain x-test-page-specific header on other pages
  it(`cache headers for specific pages should only apply to those pages/page-datas`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-2/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).not.toHaveProperty("x-test-page-specific");
  });

  // check that /posts/page-2 x-content-type-options header is not nosniff
  it(`cache headers can be overwritten for specific pages`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-2/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["x-content-type-options"]).not.toEqual("nosniff");
  });

  // other pages should have x-content-type-options header set to nosniff (default value)
  it(`cache headers overwritten for specific pages should not overwrite other pages headers`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-1/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["x-content-type-options"]).toEqual("nosniff");
  });

  // icon.png should be server with max-age=60000
  it(`cache headers can be overwritten for specific files`, async () => {
    const response = await fastify.inject({
      url: "/icon.png",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["cache-control"]).toEqual("max-age=60000");
  });

  // cache headers can be added to every page
  it(`cache headers can be added to every page`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-1/",
      method: "GET",
    });

    const response2 = await fastify.inject({
      url: "/manifest.webmanifest",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("x-test-all-pages");
    expect(response2.statusCode).toEqual(200);
    expect(response2.headers).toHaveProperty("x-test-all-pages");
  });
});
