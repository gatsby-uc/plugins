import { join, posix, resolve } from "path";
import fs from "fs-extra";

import type { FastifyPluginAsync } from "fastify";
import type { ServerSideRoute } from "../gatsby/serverRoutes";

import { reverseFixedPagePath } from "gatsby/dist/utils/page-data";
import { NEVER_CACHE_HEADER, PATH_TO_PUBLIC } from "../utils/constants";

export const handleDsgSsr: FastifyPluginAsync<{
  paths: ServerSideRoute[];
}> = async (fastify, { paths }) => {
  if (paths?.length > 0) {
    fastify.log.info(`Registering ${paths?.length} DSG & SSR route(s)`);

    const cachePath = resolve("./.cache");

    const { GraphQLEngine } = (await import(
      join(cachePath, "query-engine")
    )) as typeof import("gatsby/dist/schema/graphql-engine/entry");

    const { getData, renderPageData, renderHTML } = (await import(
      join(cachePath, "page-ssr")
    )) as typeof import("gatsby/dist/utils/page-ssr-module/entry");

    const graphqlEngine = new GraphQLEngine({
      dbPath: join(cachePath, "data", "datastore"),
    });

    const gatsby500ErrorFileExists = fs.existsSync(resolve(PATH_TO_PUBLIC, "500.html"));
    fastify.log.info(
      `Gatsby 500 error page ${
        gatsby500ErrorFileExists ? "exists" : "missing, using generic 500 error for DSG/SSR"
      }`,
    );

    // Handle page data for SSR/DSG routes
    for (const { path, mode } of paths) {
      const pageDataPath = posix.join("/page-data", path, "page-data.json");

      fastify.log.debug(`Registering "${pageDataPath}" as "${mode}" route.`);

      fastify.get(pageDataPath, async (req, reply) => {
        fastify.log.debug(`DSG/SSR for "page-data.json" @ ${path}`);
        const potentialPagePath = reverseFixedPagePath(path);
        const page = graphqlEngine.findPageByPath(potentialPagePath);

        reply.header("x-gatsby-fastify", `served-by: ${page?.mode || "dsg/ssr handler"}`);

        try {
          // Fetch Page Data adn SSR Data
          if (page && (page.mode === `DSG` || page.mode === `SSR`)) {
            const pageQueryData = await getData({
              pathName: req.url,
              graphqlEngine,
              req,
            });
            const pageData = (await renderPageData({ data: pageQueryData })) as any;
            if (page.mode === `SSR` && pageData.serverDataHeaders) {
              for (const [name, value] of Object.entries(pageData.serverDataHeaders)) {
                reply.header(name, value);
              }
            }

            reply.header(...NEVER_CACHE_HEADER);
            reply.send(pageData);
          } else {
            fastify.log.warn(`DSG/SSR for ${req.url} not found`);
            reply.code(404).send("Page data not found");
          }
        } catch (e) {
          fastify.log.error("Error rendering route", page?.path, e);
          if (gatsby500ErrorFileExists) {
            reply.code(500).sendFile("500.html");
          } else {
            reply.code(500).send("Error rendering route");
          }
        }
      });
    }

    //Handle HTML for DSG/SSR
    for (const { path, mode } of paths) {
      fastify.log.debug(`Registering "${path}" as "${mode}" route.`);

      fastify.get(path, async (req, reply) => {
        const accept = req.accepts();
        if (accept.types().includes("text/html")) {
          fastify.log.debug(`DSG/SSR for "text/html" @  ${req.url}`);
          const potentialPagePath = reverseFixedPagePath(req.url);
          const page = graphqlEngine.findPageByPath(potentialPagePath);

          reply.header("x-gatsby-fastify", `served-by: ${page?.mode || "dsg/ssr handler"}`);

          try {
            if (page && (page.mode === "DSG" || page.mode === "SSR")) {
              const data = await getData({
                pathName: potentialPagePath,
                graphqlEngine,
                req,
              });
              const results = await renderHTML({ data });
              if (page.mode === `SSR` && data.serverDataHeaders) {
                for (const [name, value] of Object.entries(data.serverDataHeaders)) {
                  reply.header(name, value);
                }
              }

              reply.header(...NEVER_CACHE_HEADER);

              reply.type("text/html").send(results);
            } else {
              fastify.log.warn(`DSG/SSR for ${req.url} not found`);
              reply.callNotFound();
            }
          } catch (e) {
            fastify.log.error(`Error rendering route @ ${page?.path}: ${e}`);
            if (gatsby500ErrorFileExists) {
              reply.code(500).sendFile("500.html");
            } else {
              reply.code(500).send("Error rendering route");
            }
          }
        } else {
          reply.callNotFound();
        }
      });
    }
  }
};
