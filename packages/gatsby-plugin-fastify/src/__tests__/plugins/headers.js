import { StatusCodes } from "http-status-codes";
import { buildHeadersProgram } from "../../gatsby/header-builder";
import { IMMUTABLE_CACHING_HEADER, NEVER_CACHE_HEADER } from "../../utils/constants";
import { FG_MODULE_HEADER } from "../../utils/headers";

describe(`Test Headers plugin`, () => {
  // feature based testing
  it(`should support SSR HTML headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/ssr",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // getServerData only headers should be added
    expect(response.headers).toHaveProperty("x-test", "Custom Headers Work!");
    // getServerData duplicate headers should overwrite custom/other headers
    expect(response.headers).toHaveProperty("x-test-ssr-overwrite", "Overwritten by SSR");
    // SSR should add custom headers added to matching paths
    expect(response.headers).toHaveProperty("x-test-ssr-kept", "ssr page");
    // SSR should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // SSR should have FG_MODULE_HEADER = SSR
    expect(response.headers[FG_MODULE_HEADER]).toContain("SSR");
    // SSR should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
  });

  it(`should support SSR JSON headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/page-data/ssr/page-data.json",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // SSR should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // SSR should have FG_MODULE_HEADER = SSR
    expect(response.headers[FG_MODULE_HEADER]).toContain("SSR");
    // SSR should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
  });

  it(`should support DSG HTML headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/generated/page-6",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // DSG HTML should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // DSG HTML should have FG_MODULE_HEADER = DSG
    expect(response.headers[FG_MODULE_HEADER]).toContain("DSG");
    // DSG HTML should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // DSG HTML should have custom headers added to matching paths
    expect(response.headers).toHaveProperty("x-test-dsg-kept", "dsg page");
  });

  it(`should support DSG JSON headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/page-data/generated/page-6/page-data.json",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // DSG JSON should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // DSG JSON should have FG_MODULE_HEADER = DSG
    expect(response.headers[FG_MODULE_HEADER]).toContain("DSG");
    // DSG JSON should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // DSG JSON should have custom headers added to matching paths
    expect(response.headers).toHaveProperty("x-test-dsg-kept", "dsg page data");
  });

  it(`should support Static HTML (SSG) headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/posts/page-1",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // Static HTML should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // Static HTML should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // Static HTML should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // Static HTML should have custom headers added to matching paths
    expect(response.headers).toHaveProperty("x-test-page-specific", "shows on /posts/page-1");
  });

  it(`should support Static JSON (SSG) headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/page-data/posts/page-1/page-data.json",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // Static JSON should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // Static JSON should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // Static JSON should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // Static JSON should have custom headers added to matching paths
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  it(`should support app-data.json headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/page-data/app-data.json",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // app-data.json should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // app-data.json should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // app-data.json should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // app-data.json should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  it(`should support sw.js headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/sw.js",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    // sw.js should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // sw.js should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // sw.js should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // sw.js should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  it(`should support function headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/api/test",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // function should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // function should have FG_MODULE_HEADER = Function
    expect(response.headers[FG_MODULE_HEADER]).toContain("Functions");
    // function should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // function should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
    // function handlers headers should overwrite configured headers
    expect(response.headers).toHaveProperty("x-test-function-overwrite", "Overwritten by FUNCTION");
  });

  it(`should support hashed static asset headers as gatsby cloud does`, async () => {
    // chunked hashed files
    const response = await fastify.inject({
      url: "/component-fake-hash.js",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // hashed static asset should have IMMUATBLE_CACHING_HEADER
    expect(response.headers).toHaveProperty(
      "cache-control",
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    // hashed static asset should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // hashed static asset should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // hashed static asset should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");

    // gatsby-image style hashed images
    const response2 = await fastify.inject({
      url: "/static/hash/hash/icon.png",
      method: "GET",
    });
    expect(response2.statusCode).toEqual(StatusCodes.OK);
    // hashed static asset should have IMMUATBLE_CACHING_HEADER
    expect(response2.headers).toHaveProperty(
      "cache-control",
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    // hashed static asset should have FG_MODULE_HEADER = Static
    expect(response2.headers[FG_MODULE_HEADER]).toContain("Static");
    // hashed static asset should have default security headers
    expect(response2.headers).toHaveProperty("x-content-type-options", "nosniff");
    // hashed static asset should support custom headers
    expect(response2.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  it(`should support unchunked root asset headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/fake-lazycomponent.js",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // hashed static asset should have no cache-control header
    expect(response.headers["cache-control"]).toBeUndefined();
    // hashed static asset should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // hashed static asset should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // hashed static asset should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  // support https://www.gatsbyjs.com/docs/how-to/images-and-media/static-folder/
  it(`should support non-hashed /static folder asset headers copied as is from /static to /public as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/test.pdf",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // non-hashed static asset should have no cache-control header
    expect(response.headers["cache-control"]).toBeUndefined();
    // non-hashed static asset should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // non-hashed static asset should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // non-hashed static asset should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  it(`should support gatsby image CDN headers as gatsby cloud does`, async () => {
    const response = await fastify.inject({
      url: "/_gatsby/image/hash/hash/indonesia.jpg",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // gatsby image CDN should have no cache-control header
    expect(response.headers["cache-control"]).toBeUndefined();
    // gatsby image CDN should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // gatsby image CDN should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // gatsby image CDN should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  it(`should support client-only route headers as gatsby cloud does`, async () => {
    // support hard-coded client-only route
    const response = await fastify.inject({
      url: "/app",
      method: "GET",
    });

    expect(response.statusCode).toEqual(StatusCodes.OK);
    // client-only route should have NEVER_CACHE_HEADER
    expect(response.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // client-only route should have FG_MODULE_HEADER = Static
    expect(response.headers[FG_MODULE_HEADER]).toContain("Static");
    // client-only route should have default security headers
    expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
    // client-only route should support custom headers
    expect(response.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");

    // support client-only route with dynamic path
    const response2 = await fastify.inject({
      url: "/app/a",
      method: "GET",
    });

    expect(response2.statusCode).toEqual(StatusCodes.OK);
    // client-only route should have NEVER_CACHE_HEADER
    expect(response2.headers).toHaveProperty("cache-control", NEVER_CACHE_HEADER["cache-control"]);
    // client-only route should have FG_MODULE_HEADER = Static
    expect(response2.headers[FG_MODULE_HEADER]).toContain("Static");
    // client-only route should have default security headers
    expect(response2.headers).toHaveProperty("x-content-type-options", "nosniff");
    // client-only route should support custom headers
    expect(response2.headers).toHaveProperty("x-test-all-pages", "shows on every page/file");
  });

  // start testing for more specific scenarios
  it(`should properly merge headers based on default settings`, async () => {
    const components = new Map();
    components.set("default", {
      componentChunkName: "fake-chunk",
    });
    components.set("cssComponent", {
      componentChunkName: "css",
    });
    const pre35Components = new Map();
    pre35Components.set("default", {});
    const manifest = {
      "fake-chunk": "fake-chunk.js",
      app: ["app-hash.js"],
      css: "css-hash.css",
    };
    const preGatsby35 = await buildHeadersProgram(
      {
        pages: components,
        components: pre35Components,
        manifest,
        publicFolder: () => "/public",
      },
      {
        features: {
          headers: {
            customHeaders: {},
            useDefaultCaching: true,
            useDefaultSecurity: true,
          },
        },
      },
      []
    );
    const withDefaults = await buildHeadersProgram(
      {
        components,
        manifest,
        publicFolder: () => "/public",
      },
      {
        features: {
          headers: {
            customHeaders: {},
            useDefaultCaching: true,
            useDefaultSecurity: true,
          },
        },
      },
      []
    );
    const withoutDefaults = await buildHeadersProgram(
      {
        publicFolder: () => "/public",
      },
      {
        features: {
          headers: {
            customHeaders: {},
            useDefaultCaching: false,
            useDefaultSecurity: false,
          },
        },
      },
      []
    );

    // check chunked CSS files
    expect(preGatsby35["/css-hash.css"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(withDefaults["/css-hash.css"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(withoutDefaults["/css-hash.css"]).toBeUndefined();

    // check pre gatsby 3.5
    expect(preGatsby35["**/*.html"]["cache-control"]).toEqual(NEVER_CACHE_HEADER["cache-control"]);
    expect(preGatsby35["/app-hash.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(preGatsby35["/fake-chunk.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );

    // check defaults
    expect(withDefaults["**/*.html"]["cache-control"]).toEqual(NEVER_CACHE_HEADER["cache-control"]);
    expect(withDefaults["/app-hash.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );
    expect(withDefaults["/fake-chunk.js"]["cache-control"]).toEqual(
      IMMUTABLE_CACHING_HEADER["cache-control"]
    );

    // check defaults
    expect(withoutDefaults["/**"]).toBeUndefined();
    expect(withoutDefaults["**/*.html"]).toBeUndefined();
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
