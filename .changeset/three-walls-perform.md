---
"gatsby-source-strapi": major
---

BREAKING CHANGES:

- This plugin now assumes Strapi 5 by default. If you are on Strapi 4, set `version: 4` in your plugin options, see the [readme](https://github.com/gatsby-uc/plugins/tree/main/packages/gatsby-source-strapi)
- Previously `strapi_id` was filled with the `documentId`, now `strapi_id` will be the regular `id`.

`documentId` is now added as a field.
`strapi_document_id_or_regular_id` contains a mixture of the both. `documentId`'s when they are available, `id`'s for content without a `documentId` (for example media or components).

If you use `strapi_id` in your code assuming it is a Strapi 5 `documentId`, you have to rewrite that code to use the `documentId` field. More info why [in the PR](https://github.com/gatsby-uc/plugins/pull/498)
