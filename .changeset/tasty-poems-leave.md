---
"gatsby-plugin-fastify": patch
---

Add 404 handler for Gatsby functions to not use default Gatsby 404. thus any unknown route under "/api" now just returns a 404 and not found text.
