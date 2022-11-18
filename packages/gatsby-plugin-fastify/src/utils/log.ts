import type { ServerSideRoute } from "../gatsby/serverRoutes";

export function countPaths(paths: ServerSideRoute[]) {
  return paths.reduce(
    (accumulator, path) => {
      switch (path.mode) {
        case "SSR": {
          accumulator.ssrCount++;
          break;
        }
        case "DSG": {
          accumulator.dsgCount++;
          break;
        }
      }
      return accumulator;
    },
    { dsgCount: 0, ssrCount: 0 }
  );
}
