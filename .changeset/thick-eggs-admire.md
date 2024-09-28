---
"gatsby-source-strapi": major
---

Support Strapi v5, while staying compatible with v4.

There are no breaking changes. I've created a major release because I don't want to bother current applications with possible bugs. Updrading to this code should be a choice.

I have removed the code for creating the unstable_createNodeManifest. In my believe, this was only for Gatsby Cloud and as Gatsby Cloud only remains in our sweet memories of the glory days, we don't need it anymore. I've also deleted the readme about Gatsby Cloud and content sync, I don't believe any plaform is supporting content sync right now, or ever again.

I have tried to support both v4 and v5 syntaxes in this release. By setting `version` on your config to 5, the new REST API syntax will be used. `publicationState=preview` will automatically be rewritten to `status=draft`.

As Strapi v5 is using documentId's over regular id's, I am now using the documentId (where available, f.e. not in components) to create the Gatsby Node id. This should keep updated relations intact when reloading data.
