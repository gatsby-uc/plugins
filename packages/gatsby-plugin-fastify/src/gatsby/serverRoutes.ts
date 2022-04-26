import type { PluginData } from "../utils/plugin-data";

export type ServerSideRoute = { path: string; mode: "DSG" | "SSR"; matchPath?: string };

export async function getServerSideRoutes(pageData: PluginData) {
  const { pages } = pageData;

  const routes: ServerSideRoute[] = [];

  for (const page of pages.values()) {
    if (page?.mode === "DSG" || page?.mode === "SSR") {
      const { path, mode } = page;
      routes.push({
        path,
        mode,
        ...(page?.matchPath && { matchPath: page.matchPath }),
      });
    }
  }

  return routes;
}
