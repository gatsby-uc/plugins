import { join, posix, resolve } from "path";

import type { FastifyPluginAsync } from "fastify";
import type { ServerSideRoute } from "../gatsby/serverRoutes";

import { reverseFixedPagePath } from "gatsby/dist/utils/page-data";
import { NEVER_CACHE_HEADER, PATH_TO_CACHE } from "../utils/constants";

export const handleServerRoutes: FastifyPluginAsync<{
  paths: ServerSideRoute[];
}> = async (fastify, { paths }) => {
  if (paths?.length > 0) {
    const { dsgCount, ssrCount } = paths.reduce(
      (acc, path) => {
        switch (path.mode) {
          case "SSR":
            acc.ssrCount++;
            break;
          case "DSG":
            acc.dsgCount++;
            break;
        }
        return acc;
      },
      { dsgCount: 0, ssrCount: 0 },
    );

    fastify.log.info(`Registering ${dsgCount} DSG route(s)`);
    fastify.log.info(`Registering ${ssrCount} SSR route(s)`);

    const cachePath = resolve(PATH_TO_CACHE);

    const { GraphQLEngine } = (await import(
      join(cachePath, "query-engine")
    )) as typeof import("gatsby/dist/schema/graphql-engine/entry");

    const { getData, renderPageData, renderHTML } = (await import(
      join(cachePath, "page-ssr")
    )) as typeof import("gatsby/dist/utils/page-ssr-module/entry");

    const graphqlEngine = new GraphQLEngine({
      dbPath: join(cachePath, "data", "datastore"),
    });

    // Handle page-data for SSR/DSG routes
    for (const { path, mode } of paths) {
      const pageDataPath = posix.join("/page-data", path, "page-data.json");

      fastify.log.debug(`Registering "${pageDataPath}" as "${mode}" route.`);

      fastify.get(pageDataPath, async (req, reply) => {
        fastify.log.debug(`DSG/SSR for "page-data.json" @ ${path}`);
        const potentialPagePath = reverseFixedPagePath(path);
        const page = graphqlEngine.findPageByPath(potentialPagePath);
        if (!page) {
          //this theoreticall shouldn't happen cause we're creating these routes based on data from build.
          throw new Error(`No page data found for path: ${req.url}`);
        }
        reply.header("x-gatsby-fastify", `served-by: ${page?.mode || "dsg/ssr handler"}`);

        try {
          // Fetch Page Data adn SSR Data
          const pageQueryData = await getData({
            pathName: req.url,
            graphqlEngine,
            req,
          });

          const pageData = (await renderPageData({ data: pageQueryData })) as any;

          if (page.mode === `SSR`) {
            if (pageQueryData?.serverDataHeaders) {
              reply.headers(pageQueryData.serverDataHeaders);
            }

            if (pageQueryData?.serverDataStatus) {
              reply.code(pageQueryData.serverDataStatus);
            }
          }

          reply.header(...NEVER_CACHE_HEADER);
          return reply.send(pageData);
        } catch (e) {
          throw new Error(`Error fetching page data for ${path}: ${e.message}`);
        }
      });
    }

    //Handle HTML for DSG/SSR
    for (const { path, mode } of paths) {
      fastify.log.debug(`Registering "${path}" as "${mode}" route.`);

      fastify.get(path, async (req, reply) => {
        const accept = req.accepts();
        if (accept.type(["html"])) {
          fastify.log.debug(`DSG/SSR for "text/html" @  ${req.url}`);
          const potentialPagePath = reverseFixedPagePath(req.url);
          const page = graphqlEngine.findPageByPath(potentialPagePath);

          if (!page) {
            throw new Error(`No page found for ${req.url}`);
          }

          reply.header("x-gatsby-fastify", `served-by: ${page?.mode || "dsg/ssr handler"}`);

          try {
            const pageQueryData = await getData({
              pathName: potentialPagePath,
              graphqlEngine,
              req,
            });

            const results = await renderHTML({ data: pageQueryData });

            if (page.mode === `SSR`) {
              if (pageQueryData?.serverDataHeaders) {
                reply.headers(pageQueryData.serverDataHeaders);
              }

              if (pageQueryData?.serverDataStatus) {
                reply.code(pageQueryData.serverDataStatus);
              }
            }

            if (page.mode === "DSG") {
              reply.header(...NEVER_CACHE_HEADER);
            }

            return reply.type("text/html").send(results);
          } catch (e) {
            throw new Error(`Error fetching page HTML for ${path}: ${e.message}`);
          }
        } else {
          fastify.log.warn(`Request for route ${req.url} does not support "text/html"`);
          return reply.code(400).send("Request must support html via the `accept` header.");
        }
      });
    }
  }
};
