import { serveGatsby } from "./plugins/gatsby";
import Fastify from "fastify";
import { getConfig } from "./utils/config";
import open from "open";

export async function gatsbyServer() {
  const {
    cli: { port, host, open: openBrowser },
    server: { prefix },
  } = getConfig();

  const fastify = Fastify({ ignoreTrailingSlash: true });

  console.info("Registered Gatsby @ ", prefix || "/");

  await fastify.register(serveGatsby);

  try {
    const listeningOn = await fastify.listen(port, host);

    console.log(`listening @ ${listeningOn}`);

    if (openBrowser) open(listeningOn);
  } catch (err) {
    console.error("Failed to start Fastify err");
    process.exit(1);
  }

  return fastify;
}
