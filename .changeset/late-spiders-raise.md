---
"gatsby-plugin-ackee-tracker": patch
"gatsby-plugin-fastify": patch
"gatsby-plugin-github-ribbon": patch
"gatsby-plugin-pinterest": patch
"gatsby-plugin-readingtime": patch
"gatsby-plugin-relative-ci": patch
"gatsby-plugin-vanilla-extract": patch
"gatsby-source-appwrite": patch
"gatsby-source-packagist": patch
"gatsby-source-s3": patch
"gatsby-source-strapi": patch
"gatsby-source-supabase": patch
---

When plugins are nested inside a Gatsby Theme they are required to have an `index.js` file in the package root. We recently removed these not knowing this requirement. Files restored and tests added.
