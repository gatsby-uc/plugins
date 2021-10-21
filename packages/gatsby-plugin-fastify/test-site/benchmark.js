const Benchmark = require("benchmark");

const { createCliConfig } = require("../src/__tests__/__utils__/config");
const { gatsbyServer } = require("gatsby-plugin-fastify/serve");
const { getServerConfig, setConfig, ConfigKeyEnum } = require("gatsby-plugin-fastify/utils/config");

Benchmark.options.minSamples = 500;
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

setConfig(ConfigKeyEnum.SERVER, getServerConfig());

(async () => {
  const server = await gatsbyServer();
  let i = 0;
  suite
    .add("Serve static file", {
      defer: true,
      fn: (def) => {
        // server
        //   .inject({
        //     method: "GET",
        //     url: "/",
        //   })
        //   .then(def.resolve)
        //   .catch(def.reject);
        console.log("Mytest goes here", i++);
        def.resolve();
      },
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", () => {
      // server.close();
      console.log("complete");
      server.close().then(() => {
        console.log("server closed");
      });
    })
    .run();
})();
