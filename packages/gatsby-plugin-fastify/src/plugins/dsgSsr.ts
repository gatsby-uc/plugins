import type { FastifyPluginAsync } from "fastify";
import path from "path";

import { reverseFixedPagePath } from "gatsby/dist/utils/page-data";

export const handleDsgSsr: FastifyPluginAsync = async (fastify, {}) => {
  console.info("Listening for DSG and SSR requests");

  const cachePath = path.resolve("./.cache");

  const { GraphQLEngine } = (await import(
    path.join(cachePath, "query-engine")
  )) as typeof import("gatsby/dist/schema/graphql-engine/entry");

  const { getData, renderPageData, renderHTML } = (await import(
    path.join(cachePath, "page-ssr")
  )) as typeof import("gatsby/dist/utils/page-ssr-module/entry");

  const graphqlEngine = new GraphQLEngine({
    dbPath: path.join(cachePath, "data", "datastore"),
  });

  // Handle page data for SSR/DSG routes
  fastify.get<{
    Params: {
      "*": string;
    };
  }>("/page-data/*", async (req, reply) => {
    const requestedPagePath = req.params["*"].replace("/page-data.json", "");

    console.log("DSG/SSR for `page-data.json` @ ", requestedPagePath);

    const potentialPagePath = reverseFixedPagePath(requestedPagePath);
    const page = graphqlEngine.findPageByPath(potentialPagePath);

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
        reply.header("x-gatsby-fastify", `served-by: ${page.mode}`);

        reply.send(pageData);
      } else {
        reply.code(404).send("Page data not found");
      }
    } catch (e) {
      console.error("Error rendering route", page?.path, e);
      reply.code(500).sendFile("500.html");
    }
  });

  //Handle HTML for DSG/SSR
  fastify.get("*", async (req, reply) => {
    const accept = req.accepts();
    if (accept.types().includes("text/html")) {
      console.log("DSG/SSR for `text/html` @ ", req.url);
      const potentialPagePath = reverseFixedPagePath(req.url);
      const page = graphqlEngine.findPageByPath(potentialPagePath);

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

          reply.header("x-gatsby-fastify", `served-by: ${page.mode}`);
          reply.type("text/html").send(results);
        } else if (req.url === "/favicon.ico") {
          reply.code(404).send("Not found");
        } else {
          reply.callNotFound();
        }
      } catch (e) {
        console.error("Error rendering route", page?.path, e);
        reply.code(500).sendFile("500.html");
      }
    }
  });
};
