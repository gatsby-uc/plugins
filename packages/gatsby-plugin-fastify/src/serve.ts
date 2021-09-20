import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils";
import open from "open";

export function gatsbyServer() {
  const {
    cli: { port, host, open: openBrowser },
    server: { prefix },
    program,
  } = getConfig();

  const fastify = Fastify({ ignoreTrailingSlash: true });

  console.info("Registered Gatsby @ ", prefix || "/");

  fastify.register(serveGatsby);

  fastify.listen(port, host, (err, listeningOn) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`listening @ ${listeningOn}`);

    if (openBrowser) open(listeningOn);
  });
}
