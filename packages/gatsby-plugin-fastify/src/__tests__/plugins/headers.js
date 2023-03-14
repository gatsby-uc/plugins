import { StatusCodes } from "http-status-codes";
import { buildHeadersProgram } from "../../gatsby/header-builder";
import { IMMUTABLE_CACHING_HEADER, NEVER_CACHE_HEADER } from "../../utils/constants";
import { FG_MODULE_HEADER } from "../../utils/headers";

describe(`Test Headers plugin`, () => {
  // test header-builder
  it(`should properly merge headers based on default settings`, async () => {
    const components = new Map();
    components.set("default", {
      componentChunkName: "fakeChunk",
    });
    components.set("cssComponent", {
      componentChunkName: "css",
    });
    const pre35Components = new Map();
    pre35Components.set("default", {});
    const manifest = {
      fakeChunk: "fakeChunk.js",
      app: ["app.js"],
      css: "css.css",
    };
    const preGatsby35 = buildHeadersProgram(
      {
        pages: components,
        components: pre35Components,
        manifest,
      },
      {
        features: {
          headers: {
            customHeaders: {},
            useDefaultCaching: true,
            useDefaultSecurity: true,
          },
        },
      }
    );
    const withDefaults = buildHeadersProgram(
      {
        components,
        manifest,
      },
      {
        features: {
          headers: {
            customHeaders: {},
            useDefaultCaching: true,
            useDefaultSecurity: true,
          },
        },
      }
    );
    const withoutDefaults = buildHeadersProgram(
      {},
      {
        features: {
          headers: {
            customHeaders: {},
            useDefaultCaching: false,
            useDefaultSecurity: false,
          },
        },
      }
    );

    // check chunked CSS files
    expect(preGatsby35["/css.css"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(withDefaults["/css.css"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(withoutDefaults["/css.css"]).toBeUndefined();

    // check pre gatsby 3.5
    expect(preGatsby35["/**"]["X-Content-Type-Options"]).toEqual("nosniff");
    expect(preGatsby35["**/*.html"]["cache-control"]).toEqual(NEVER_CACHE_HEADER["cache-control"]);
    expect(preGatsby35["/app.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(preGatsby35["/fakeChunk.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );

    // check defaults
    expect(withDefaults["/**"]["X-Content-Type-Options"]).toEqual("nosniff");
    expect(withDefaults["**/*.html"]["cache-control"]).toEqual(NEVER_CACHE_HEADER["cache-control"]);
    expect(withDefaults["/app.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(withDefaults["/fakeChunk.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );

    // check defaults
    expect(withoutDefaults["/**"]).toBeUndefined();
    expect(withoutDefaults["**/*.html"]).toBeUndefined();
  });

  // check non-chunked root .js files (lazy-loaded component files)
  it(`should unset cache-control on root js files that aren't in chunks`, async () => {
    const response = await fastify.inject({
      url: "/fake-lazycomponent.js",
      method: "GET",
    });

    console.log("fake-lazycomponent.js", response.headers);
    expect(response.statusCode).toEqual(200);
    expect(response.headers["cache-control"]).toBeUndefined();
  });

  // test static headers
  it(`cache headers can be added to specific pages`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-1",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("x-test-page-specific");
  });

  it(`successive custom headers overwrite previous entries`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-1/index.html",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty(
      "x-test-page-specific",
      "shows on /posts/page-1 and its page-data (overwritten)"
    );
  });

  it(`custom headers for specific pages should only apply to those pages/page-datas`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-2/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).not.toHaveProperty("x-test-page-specific");
  });

  it(`default headers can be overwritten for specific pages`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-2/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["x-content-type-options"]).not.toEqual("nosniff");
  });

  it(`cache headers overwritten for specific pages should not overwrite other pages headers`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-1/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["x-content-type-options"]).toEqual("nosniff");
  });

  it(`cache headers can be overwritten for specific files`, async () => {
    const response = await fastify.inject({
      url: "/icon.png",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["cache-control"]).toEqual("max-age=60000");
  });

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

  // test server-routes headers
  it(`Should Add custom headers to DSG routes`, async () => {
    const response = await fastify.inject({
      url: "/faker",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("x-test-all-pages");
  });

  it(`Should Add custom headers to SSR routes alongside SSR headers`, async () => {
    const response = await fastify.inject({
      url: "/ssr",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("x-test-all-pages");
    expect(response.headers).toHaveProperty("x-test", "Custom Headers Work!");
    expect(response.headers).toHaveProperty("x-frame-options", "DENY");
  });

  it(`Should overwrite custom headers in SSR paths with headers set in the SSR file`, async () => {
    const response = await fastify.inject({
      url: "/ssr",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["x-test-ssr-kept"]).toEqual("ssr page");
    expect(response.headers["x-test-ssr-overwrite"]).toEqual("Overwritten by SSR");
  });

  // test reverse-proxy headers
  it(`Should apply customHeaders to reverse proxy URLs`, async () => {
    const response = await fastify.inject({
      url: "/example-proxy-star/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.headers[FG_MODULE_HEADER]).toContain("Reverse Proxy");
    expect(response.payload).toContain("Example Domain");
    expect(response.headers).toHaveProperty("x-test-all-pages");
    expect(response.headers["x-frame-options"]).toEqual("DENY");
  });

  // test redirects headers
  it(`Should add headers to redirect responses`, async () => {
    const response = await fastify.inject({
      url: "/redirect-weird/test/more-stuff",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.TEMPORARY_REDIRECT);
    expect(response.headers).toHaveProperty("x-test-all-pages");
    expect(response.headers["x-frame-options"]).toEqual("DENY");
  });

  // test functions headers
  it(`Should add headers to function routes`, async () => {
    const response = await fastify.inject({
      url: "/api/test",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("x-test-all-pages");
    expect(response.headers["x-frame-options"]).toEqual("DENY");
  });

  // test client-only routes headers
  it(`should add headers to client routes`, async () => {
    const response = await fastify.inject({
      url: "/app/",
      method: "GET",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toHaveProperty("x-test-all-pages");
    expect(response.headers["x-frame-options"]).toEqual("DENY");
  });
});
