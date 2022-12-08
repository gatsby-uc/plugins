import { PathConfig } from "../plugins/client-routes";
import { formatMatchPath } from "../utils/routes";
import type { PluginData } from "../utils/plugin-data";
import { TrailingSlash } from "gatsby-page-utils";

export type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

export async function getClientSideRoutes(pageData: PluginData, trailingSlash: TrailingSlash) {
  const { pages } = pageData;

  const routes: NoUndefinedField<PathConfig>[] = [];

  for (const page of pages.values()) {
    if (page?.matchPath && page?.mode !== "SSR" && page?.mode !== "DSG") {
      routes.push({
        matchPath: formatMatchPath(page.matchPath, trailingSlash),
        path: page.path,
      });
    }
  }

  return routes;
}
