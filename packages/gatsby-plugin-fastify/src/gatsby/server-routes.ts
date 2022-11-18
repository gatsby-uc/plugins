import type { PluginData } from "../utils/plugin-data";
import { formatMatchPath } from "../utils/routes";

export type ServerSideRoute = {
  path: string;
  mode: "DSG" | "SSR";
  matchPath: string;
};

export async function getServerSideRoutes(pageData: PluginData) {
  const { pages } = pageData;
  const routes: ServerSideRoute[] = [];

  for (const page of pages.values()) {
    if (page?.mode === "DSG" || page?.mode === "SSR") {
      routes.push({
        path: page.path,
        mode: page.mode,
        matchPath: page?.matchPath ? formatMatchPath(page.matchPath) : page.path,
      });
    }
  }

  return routes;
}
