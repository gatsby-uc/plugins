import { IRedirect } from "gatsby/dist/redux/types";

export type GatsbyFastifyProxy = { toPath: string; fromPath: string };

export function getProxiesAndRedirects(store) {
  const { redirects: proxiesAndRedirects } = store.getState();

  return proxiesAndRedirects.reduce(
    (acc, curr) => {
      if (curr.statusCode == 200) {
        acc.proxies.push({
          toPath: curr.toPath.replace(/\*$/, ""),
          fromPath: curr.fromPath.replace(/\*$/, ""),
        });
      } else {
        acc.redirects.push(curr);
      }

      return acc;
    },
    { redirects: [] as IRedirect[], proxies: [] as GatsbyFastifyProxy[] }
  );
}
