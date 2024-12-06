---
"gatsby-source-strapi": major
---

This plugin now assumes Strapi 5 by default.

I've created a major release because I made a breaking change in the `strapi_id`.
With the rewrite to `documentId`'s I assumed never needing the regular `id` anymore.
Now I hit the usecase that the Users Permissions plugin doesn't use the `documentId`'s yet and needs regular `id`'s. So I need them in the Gatsby schema.

In gatsby-source-strapi 4.0.0 `strapi_id` was filled with the `documentId`.

In gatsby-source-strapi 5.0.0 `strapi_id` will be the regular `id`, `documentId` will be available and `strapi_document_id_or_regular_id` contains a mixture of the both. `documentId`'s when they are available, `id`'s for content without a `documentId` (for example media or components).
