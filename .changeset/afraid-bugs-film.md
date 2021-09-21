---
"gatsby-plugin-fastify": patch
---

Disable redirects for static files from no following slash to path ending in a slash. This helps fix a bug in static file serving and make way for DSG/SSR but has also been determined to be unneeded and a performance hinderance.
