const StatusCodes = require("http-status-codes");
const Benchmark = require("benchmark");
const {
  getServerConfig,
  setConfig,
  ConfigKeyEnum,
  getConfig,
} = require("gatsby-plugin-fastify/dist/utils/config");
const { serveGatsby } = require("gatsby-plugin-fastify/dist/plugins/gatsby");
const Fastify = require("fastify");

Benchmark.options.minSamples = 500;
const suite = Benchmark.Suite();

function createCliConfig({ host, port, logLevel, open }) {
  return {
    host,
    h: host,
    port,
    p: port,
    logLevel,
    l: logLevel,
    open,
    o: open,
  };
}

setConfig(
  ConfigKeyEnum.CLI,
  createCliConfig({
    port: 3001,
    host: "127.0.0.1",
    logLevel: "fatal",
    open: false,
  })
);

const serverConfig = getServerConfig();
setConfig(ConfigKeyEnum.SERVER, serverConfig);

function expectResp(def, path, code = StatusCodes.OK) {
  return (res) => {
    if (res.statusCode !== code) {
      console.log(`Expected status code ${code}, got ${res.statusCode} from ${path}`);
      process.exit(1);
    }
    def.resolve();
  };
}

(async () => {
  const {
    cli: { logLevel },
  } = getConfig();
  const server = Fastify({
    ignoreTrailingSlash: true,
    logger: {
      level: logLevel,
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  });

  await server.register(serveGatsby, { prefix: "" });

  console.log("server is ready");

  suite
    .add("Serve SSG HTML file from root", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/",
          })
          .then(expectResp(def, "/"));
      },
    })
    .add("Serve SSG HTML from path", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/posts/page-1/",
            timeout: 10000,
          })
          .then(expectResp(def, "/posts/page-1/"));
      },
    })
    .add("Serve SSG `page-data.json` from path", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/page-data/posts/page-1/page-data.json",
          })
          .then(expectResp(def, "/page-data/posts/page-1/page-data.json"));
      },
    })
    .add("Serve CSR", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/app/",
          })
          .then(expectResp(def, "/app"));
      },
    })
    .add("Serve SSR HTML", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/ssr",
            hostname: "localhost:3001",
          })
          .then(expectResp(def, "/ssr"));
      },
    })
    .add("Serve DSG HTML", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/generated/page-6",
          })
          .then(expectResp(def, "/generated/page-6"));
      },
    })
    .add("Serve DSG/SSR page-data.json", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/page-data/generated/page-6/page-data.json",
          })
          .then(expectResp(def, "/page-data/generated/page-6/page-data.json"));
      },
    })
    .add("Serve 404", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/nonExistentRoute",
          })
          .then(expectResp(def, "/nonExistentRoute", StatusCodes.NOT_FOUND));
      },
    })
    .add("Serve 500", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/ssrBad/",
          })
          .then(expectResp(def, "/ssrBad/", StatusCodes.INTERNAL_SERVER_ERROR));
      },
    })
    .add("Serve Redirect", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/perm-redirect/",
          })
          .then(expectResp(def, "/perm-redirect/", StatusCodes.PERMANENT_REDIRECT));
      },
    })
    .add("Serve Reverse Proxy", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/example-proxy/",
          })
          .then(expectResp(def, "/example-proxy/", StatusCodes.OK));
      },
    })
    .add("Serve Function", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/api/test",
          })
          .then(expectResp(def, "/api/test", StatusCodes.OK));
      },
    })
    .add("Serve Splat Function", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/api/test1/thisShouldWork",
          })
          .then(expectResp(def, "/api/test1/thisShouldWork", StatusCodes.OK));
      },
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", () => {
      console.log("complete");
      server.close().then(() => {
        console.log("server closed");
      });
    })
    .run();
})();
