import type { ServerSideRoute } from "../gatsby/server-routes";

export function countPaths(paths: ServerSideRoute[]) {
  const results = { dsgCount: 0, ssrCount: 0 };

  for (const path of paths) {
    if (path.mode === "SSR") {
      results.ssrCount += 1;
    } else if (path.mode === "DSG") {
      results.dsgCount += 1;
    }
  }

  return results;
}
