---
"gatsby-plugin-fastify": minor
---

Upgraded fastify to v4 and bumped majors on related and unrelated packages.

## Breaking Changes

- Logging no longer defaults to "pretty print" unless the environment variable`NODE_ENV` equals `development`.

- Changes were made to the static file servers config. This fixed issues introduced by fastify updates. While this didn't break tests or knowingly intoduce bugs please let us know if you see any behavior changes.
