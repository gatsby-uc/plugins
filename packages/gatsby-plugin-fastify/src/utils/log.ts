import type { ServerSideRoute } from "../gatsby/server-routes";

export function countPaths(paths: ServerSideRoute[]) {
  const results = { dsgCount: 0, ssrCount: 0 };

  for (const path of paths) {
    path.mode === "SSR" && results.ssrCount++;
    path.mode === "DSG" && results.dsgCount++;
  }

  return results;
}
