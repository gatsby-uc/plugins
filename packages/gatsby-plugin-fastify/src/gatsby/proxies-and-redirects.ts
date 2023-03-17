import type { Store } from "gatsby";
import type { IRedirect } from "gatsby/dist/redux/types";

export type GatsbyFastifyProxy = { toPath: string; fromPath: string };

export function getProxiesAndRedirects(store: Store) {
  const { redirects: proxiesAndRedirects }: { redirects: IRedirect[] } = store.getState();

  const results = { redirects: [] as IRedirect[], proxies: [] as GatsbyFastifyProxy[] };

  for (const current of proxiesAndRedirects) {
    if (current.statusCode == 200) {
      results.proxies.push({
        toPath: current.toPath,
        fromPath: current.fromPath,
      });
    } else {
      results.redirects.push(current);
    }
  }

  return results;
}
