---
"gatsby-source-s3": patch
---

General cleanup of types. Implemented complete types for `createSchemaCustomization` to prevent errors related to querying bucket items even if none excist. Improved error handling, plugin will now break build if it cannot connect to specified buckets.
