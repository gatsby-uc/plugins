import type { Store } from "gatsby";
import type { TrailingSlash } from "gatsby-page-utils";

export function getTrailingSlash(store: Store): TrailingSlash {
  return store.getState().config.trailingSlash;
}
