---
"gatsby-plugin-fastify": minor
---

We've changed the default redirect codes to 307/308 from 301/302. See the redirects docs for more info. This won't break most use cases, unless you were expecting a specific response code. You may uses Gatsby's "statusCode" field to explicitly set the satus code back to 301/302 when creating the redirect.
