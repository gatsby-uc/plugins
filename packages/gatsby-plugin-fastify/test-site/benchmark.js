const Benchmark = require("benchmark");
const { createCliConfig } = require("../src/__tests__/__utils__/config");
const { gatsbyServer } = require("gatsby-plugin-fastify/serve");
const { getServerConfig, setConfig, ConfigKeyEnum } = require("gatsby-plugin-fastify/utils/config");

Benchmark.options.minSamples = 500;
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

setConfig(ConfigKeyEnum.SERVER, getServerConfig());

function expectResp(def, path, code = 200) {
  return (res) => {
    if (res.statusCode !== code) {
      console.log(path, res.statusCode);
      throw new Error(`Expected status code ${code}, got ${res.statusCode}`);
    }
    def.resolve();
  };
}

(async () => {
  try {
    console.log("launching server");
    const server = await gatsbyServer().catch((err) => {
      console.error(err);
    });

    await server.ready();

    console.log("server ready");
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
      .add("Serve 404", {
        defer: true,
        fn: (def) => {
          server
            .inject({
              method: "GET",
              url: "/nonExistentRoute",
            })
            .then(expectResp(def, "/nonExistentRoute", 404));
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
            .then(expectResp(def, "/perm-redirect/", 301));
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
            .then(expectResp(def, "/api/test", 200));
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
