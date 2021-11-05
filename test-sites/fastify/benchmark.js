const Benchmark = require("benchmark")
const {
  getServerConfig,
  setConfig,
  ConfigKeyEnum,
  getConfig,
} = require("gatsby-plugin-fastify/utils/config")
const { serveGatsby } = require("gatsby-plugin-fastify/plugins/gatsby")
const Fastify = require("fastify")

Benchmark.options.minSamples = 500
const suite = Benchmark.Suite()

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
  }
}

setConfig(
  ConfigKeyEnum.CLI,
  createCliConfig({
    port: 3001,
    host: "127.0.0.1",
    logLevel: "fatal",
    open: false,
  })
)

const serverConfig = getServerConfig()
setConfig(ConfigKeyEnum.SERVER, serverConfig)

function expectResp(def, path, code = 200) {
  return (res) => {
    if (res.statusCode !== code) {
      console.log(
        `Expected status code ${code}, got ${res.statusCode} from ${path}`
      )
      process.exit(1)
    }
    def.resolve()
  }
}

;(async () => {
  const {
    cli: { logLevel },
  } = getConfig()
  const server = Fastify({
    ignoreTrailingSlash: true,
    logger: { level: logLevel, prettyPrint: true },
    disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
  })

  await server.register(serveGatsby, { prefix: "" })

  console.log("server is ready")

  suite
    .add("Serve SSG HTML file from root", {
      defer: true,
      fn: (def) => {
        server
          .inject({
            method: "GET",
            url: "/",
          })
          .then(expectResp(def, "/"))
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
          .then(expectResp(def, "/posts/page-1/"))
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
          .then(expectResp(def, "/page-data/posts/page-1/page-data.json"))
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
          .then(expectResp(def, "/app"))
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
          .then(expectResp(def, "/ssr"))
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
          .then(expectResp(def, "/generated/page-6"))
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
          .then(expectResp(def, "/page-data/generated/page-6/page-data.json"))
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
          .then(expectResp(def, "/nonExistentRoute", 404))
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
          .then(expectResp(def, "/ssrBad/", 500))
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
          .then(expectResp(def, "/perm-redirect/", 301))
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
          .then(expectResp(def, "/api/test", 200))
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
          .then(expectResp(def, "/api/test1/thisShouldWork", 200))
      },
    })
    .on("cycle", function (event) {
      console.log(String(event.target))
    })
    .on("complete", () => {
      console.log("complete")
      server.close().then(() => {
        console.log("server closed")
      })
    })
    .run()
})()
