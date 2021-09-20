import type { FastifyPluginAsync } from "fastify";
import type { ProgramConfig } from "../utils";
import path from "path";
import fastifyAccepts from "fastify-accepts";
import fp from "fastify-plugin";
import { reverseFixedPagePath } from "gatsby/dist/utils/page-data";

export const handleDsgSsr: FastifyPluginAsync<{
  program: ProgramConfig;
}> = async (fastify, { program }) => {
  console.info("Listening for DSG and SSR requests");

  const { GraphQLEngine } = (await import(
    path.join(program.directory, ".cache", "query-engine")
  )) as typeof import("gatsby/dist/schema/graphql-engine/entry");

  const { getData, renderPageData, renderHTML } = (await import(
    path.join(program.directory, ".cache", "page-ssr")
  )) as typeof import("gatsby/dist/utils/page-ssr-module/entry");

  const graphqlEngine = new GraphQLEngine({
    dbPath: path.join(program.directory, ".cache", "data", "datastore"),
  });

  // Handle page data for SSR/DSG routes
  fastify.get<{
    Params: {
      pagePath: string;
    };
  }>("/page-data/:pagePath/page-data.json", async (req, reply) => {
    const requestedPagePath = req.params.pagePath;
    // This check mimics Gatsby implementation, not sure why it exists.
    // if (!requestedPagePath) {
    //   return;
    // }

    console.log("DSG/SSR for `page-data.json` @ ", requestedPagePath);

    const potentialPagePath = reverseFixedPagePath(requestedPagePath);
    const page = graphqlEngine.findPageByPath(potentialPagePath);

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

      reply.send(pageData);
    }
  });

  fastify.setNotFoundHandler(async (req, reply) => {
    const accept = req.accepts();
    console.log("types accept", accept.types(["text/html"]));
    if (accept.types(["text/html"])) {
      console.log("DSG/SSR for `text/html` @ ", req.url);
      const potentialPagePath = reverseFixedPagePath(req.url);
      const page = graphqlEngine.findPageByPath(potentialPagePath);

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

        reply.type("text/html").send(results);
      }
    } else {
      reply.code(404).sendFile("404.html");
    }
  });
};
