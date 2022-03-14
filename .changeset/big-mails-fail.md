---
"gatsby-plugin-fastify": minor
---

This plugin's focus is on serving the web app. Compression should be handled by an edge server (e.g. Nginx). Therefore we are removing this feature, this should not break an existing config, though you may see a warning during build if you explicitly set the compression setting in your `gatsby-config.js`.
