// This code only works because I've editted the fastify-static implementation to not encodeURI on file names. https://github.com/fastify/fastify-static/issues/234
// Work around for https://github.com/fastify/fastify/issues/3331
// Update, SSR/DSG was implemented without wildcard so this was not an issue. In the future we may need to change this back if we revert to not wildcarding static routes.
// not sure what cahnged with fastify v4 but it seems we had to switch static to not do wild card to get basic routes to not do infinit redirects.
export function formatMatchPath(matchPath?: string): string | null {
  if (matchPath === undefined) {
    return null;
  }
  return matchPath.replace(/\/\*$/, "*");
}
