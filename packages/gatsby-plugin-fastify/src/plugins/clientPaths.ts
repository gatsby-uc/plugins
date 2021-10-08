import path from "path";

import type { FastifyPluginAsync } from "fastify";
import type { NoUndefinedField } from "../gatsby/clientSideRoutes";

import { getConfig } from "../utils/config";

export type PathConfig = {
  matchPath: string | undefined;
  path: string;
};

export const handleClientOnlyPaths: FastifyPluginAsync<{
  paths: NoUndefinedField<PathConfig>[];
}> = async (fastify, { paths }) => {
  const {
    server: { preloadLinks: linkList, earlyHints },
  } = getConfig();
  for (const p of paths) {
    console.info("Registering client-only route: ", p.path);

    const preloadLinks = linkList[p.path];

    const fastifyMatchPath = p.matchPath.replace(/\/\*$/, "*");

    fastify.get(
      fastifyMatchPath,
      {
        exposeHeadRoute: true,
      },
      async (_req, reply) => {
        if (preloadLinks && earlyHints) {
          console.info("Sending Early hints", preloadLinks);
          await reply.eh.add(preloadLinks);
        } else {
          console.log("No preload links found for", p.path, preloadLinks, linkList);
        }

        reply.header("x-gatsby-fastify", `served-by: client-only-routes`);
        reply.sendFile("index.html", path.resolve("./public", p.path.replace("/", "")));
      },
    );
  }
};
