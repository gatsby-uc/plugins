import type { PluginData } from "../utils/plugin-data";
import { formatMatchPath } from "../utils/routes";

export type ServerSideRoute = { path: string; mode: "DSG" | "SSR" };

export async function getServerSideRoutes(pageData: PluginData) {
  const { pages } = pageData;
  const routes: ServerSideRoute[] = [];

  for (const page of pages.values()) {
    if (page?.mode === "DSG" || page?.mode === "SSR") {
      const { path, mode, matchPath } = page;

      routes.push({
        path: formatMatchPath(matchPath) ?? path,
        mode,
      });
    }
  }

  return routes;
}
