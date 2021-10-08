import { PathConfig } from "../plugins/clientPaths";

export type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

export async function getClientSideRoutes(pageData) {
  const { pages } = pageData;

  const routes: NoUndefinedField<PathConfig>[] = [];

  for (const page of pages.values()) {
    if (page?.matchPath) {
      routes.push({
        matchPath: page.matchPath,
        path: page.path,
      });
    }
  }

  return routes;
}
