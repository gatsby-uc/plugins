import type { ServerSideRoute } from "../gatsby/serverRoutes";

export function countPaths(paths: ServerSideRoute[]) {
  return paths.reduce(
    (acc, path) => {
      switch (path.mode) {
        case "SSR":
          acc.ssrCount++;
          break;
        case "DSG":
          acc.dsgCount++;
          break;
      }
      return acc;
    },
    { dsgCount: 0, ssrCount: 0 }
  );
}
