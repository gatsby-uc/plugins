import { join, posix, resolve } from "node:path";
import { StatusCodes } from "http-status-codes";

import type { FastifyPluginAsync } from "fastify";
import type { ServerSideRoute } from "../gatsby/server-routes";

import { reverseFixedPagePath } from "gatsby/dist/utils/page-data";
import { NEVER_CACHE_HEADER, PATH_TO_CACHE } from "../utils/constants";
import { removeQueryParmsFromUrl } from "../utils/routes";
import { countPaths } from "../utils/log";

export const handleServerRoutes: FastifyPluginAsync<{
  paths: ServerSideRoute[];
}> = async (fastify, { paths }) => {
  if (paths?.length > 0) {
    const { dsgCount, ssrCount } = countPaths(paths);

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

      fastify.get(pageDataPath, async (request, reply) => {
        fastify.log.debug(`DSG/SSR for "page-data.json" @ ${path}`);
        const workingURL = removeQueryParmsFromUrl(request.url);
        const potentialPagePath = reverseFixedPagePath(path);
        const page = graphqlEngine.findPageByPath(potentialPagePath);
        if (!page) {
          //this theoreticall shouldn't happen cause we're creating these routes based on data from build.
          throw new Error(`No page data found for path: ${workingURL}`);
        }
        reply.appendModuleHeader(`${page?.mode as "DSG" | "SSR"}`);

        try {
          // Fetch Page Data and SSR Data
          const pageQueryData = await getData({
            pathName: workingURL,
            graphqlEngine,
            req: request,
          });

          const pageData = (await renderPageData({ data: pageQueryData })) as unknown;

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
        } catch (error) {
          if (error instanceof Error) {
            throw new TypeError(`Error fetching page data for ${path}: ${error.message}`);
          }
        }
      });
    }

    //Handle HTML for DSG/SSR
    for (const { path, mode, matchPath } of paths) {
      fastify.log.debug(`Registering "${path}" as "${mode}" route.`);

      fastify.get(matchPath, async (request, reply) => {
        const accept = request.accepts();
        const workingURL = removeQueryParmsFromUrl(request.url);

        if (accept.type(["html"])) {
          fastify.log.debug(`DSG/SSR for "text/html" @  ${request.url}`);
          const potentialPagePath = reverseFixedPagePath(workingURL);
          const page = graphqlEngine.findPageByPath(potentialPagePath);

          if (!page) {
            throw new Error(`No page found for ${workingURL}`);
          }

          reply.appendModuleHeader(`${page?.mode as "DSG" | "SSR"}`);

          try {
            const pageQueryData = await getData({
              pathName: potentialPagePath,
              graphqlEngine,
              req: request,
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
          } catch (error) {
            if (error instanceof Error) {
              throw new TypeError(`Error fetching page HTML for ${path}: ${error?.message}`);
            }
          }
        } else {
          fastify.log.warn(`Request for route ${request.url} does not support "text/html"`);
          return reply
            .code(StatusCodes.BAD_REQUEST)
            .send("Request must support html via the `accept` header.");
        }
      });
    }
  }
};
