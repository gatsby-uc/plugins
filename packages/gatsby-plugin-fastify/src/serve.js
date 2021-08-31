import { serveGatsby } from "./plugins/gatsby";
import { getConfig } from "./utils";
import Fastify from "fastify";

const port = process.env.PORT || 8080;
const address = process.env.ADDRESS || "127.0.0.1";

const { paths, redirects, prefix = "" } = getConfig();

const fastify = Fastify({ ignoreTrailingSlash: true });

console.log("Registering Gatsby @ ", prefix || "/");

fastify.register(serveGatsby, {
  paths,
  redirects,
  prefix,
});

fastify.listen(port, address, (err, listeningOn) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`listening @ ${listeningOn}`);
});
