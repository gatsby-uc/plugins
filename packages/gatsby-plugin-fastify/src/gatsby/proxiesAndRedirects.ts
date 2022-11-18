import type { Store } from "gatsby";
import type { IRedirect } from "gatsby/dist/redux/types";

export type GatsbyFastifyProxy = { toPath: string; fromPath: string };

export function getProxiesAndRedirects(store: Store) {
  const { redirects: proxiesAndRedirects }: { redirects: IRedirect[] } = store.getState();

  return proxiesAndRedirects.reduce(
    (accumulator, current) => {
      if (current.statusCode == 200) {
        accumulator.proxies.push({
          toPath: current.toPath.replace(/\*$/, ""),
          fromPath: current.fromPath.replace(/\*$/, ""),
        });
      } else {
        accumulator.redirects.push(current);
      }

      return accumulator;
    },
    { redirects: [] as IRedirect[], proxies: [] as GatsbyFastifyProxy[] }
  );
}
