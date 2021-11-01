const Benchmark = require("benchmark");
const { createCliConfig } = require("../src/__tests__/__utils__/config");
const { gatsbyServer } = require("gatsby-plugin-fastify/serve");
const { getServerConfig, setConfig, ConfigKeyEnum } = require("gatsby-plugin-fastify/utils/config");

Benchmark.options.minSamples = 10;
Benchmark.options.async = true;
const suite = Benchmark.Suite();

setConfig(
  ConfigKeyEnum.CLI,
  createCliConfig({
    port: 3001,
    host: "127.0.0.1",
    logLevel: "fatal",
    open: false,
  }),
);

const serverConfig = getServerConfig();
console.log(serverConfig);
setConfig(ConfigKeyEnum.SERVER, serverConfig);

(async () => {
  try {
    const server = await gatsbyServer().catch((err) => {
      console.error(err);
    });

    await server.ready();

    console.log("server is ready");

    suite
      .add("Serve Static HTML file from root", {
        defer: true,
        fn: async (def) => {
          server
            .inject({
              method: "GET",
              url: "/",
            })
            .then((res) => {
              def.resolve();
            });
        },
      })
      .add("Serve SSG HTML from path", {
        defer: true,
        fn: (def) => {
          server
            .inject({
              method: "GET",
              url: "/posts/page-1",
            })
            .then((res) => {
              console.log("ssg", res.statusCode);
              def.resolve();
            });
        },
      })
      .add("Serve SSG `page-data.json` from path", {
        defer: true,
        fn: async (def) => {
          server
            .inject({
              method: "GET",
              url: "/page-data/posts/page-1/page-data.json",
            })
            .then((res) => def.resolve());
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
            .then((res) => def.resolve());
        },
      })
      .add("Serve SSR HTML", {
        defer: true,
        fn: (def) => {
          server
            .inject({
              method: "GET",
              url: "/ssr",
            })
            .then((res) => {
              console.log("SSR", res.statusCode, res.headers);
              def.resolve();
            });
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
            .then((res) => {
              console.log("DSG html", res.statusCode, res.headers);
              def.resolve();
            });
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
            .then((res) => {
              console.log("DSG pagedata", res.statusCode, res.headers);
              def.resolve();
            });
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
            .then((res) => {
              def.resolve();
            });
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
            .then((res) => {
              console.log("500", res.statusCode);
              def.resolve();
            });
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
            .then((res) => {
              def.resolve();
            });
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
            .then((res) => def.resolve());
        },
      })
      .add("Serve Splat Function", {
        defer: true,
        fn: (def) => {
          server
            .inject({
              method: "GET",
              url: "/api//api/test1/thisShouldWork",
            })
            .then((res) => def.resolve());
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
  } catch (err) {
    console.error(err);
  }
})();
