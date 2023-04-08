---
"gatsby-source-strapi": patch
---

singleTypes return a 404 when it isn't updated since the latest fetch. Therefor, errors would be silenced. Fix this to report errors that are not 404
