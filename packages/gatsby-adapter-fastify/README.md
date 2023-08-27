<p align="center">
  <img src="https://github.com/gatsby-uc/plugins/raw/HEAD/packages/gatsby-adapter-fastify/logo.png" alt="Gatsby + Fastify"/>
</p>
<p align="center">
  <h2 align="center">gatsby-adapter-fastify</h2>
</p>
<p align="center">
  <i>
    Gatsby Adapter for easy integration with Fastify.
  </i>
</p>
<p align="center">
  <img alt="MIT License" src="https://img.shields.io/github/license/gatsby-uc/plugins?style=flat-square">
  <img alt="NPM version" src="https://img.shields.io/npm/v/gatsby-adapter-fastify?style=flat-square">
  <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/gatsby-adapter-fastify/peer/fastify?style=flat-square">
  <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/gatsby-adapter-fastify/peer/gatsby?style=flat-square">
</p>

# About

`gatsby-adapter-fastify` gives you a way to integrate your Gatsby site with a Node.js server using Fastify. Use to serve a standard Gatsby.js site normally - the adapter will take care of everything.

# Installation

Install the plugin using npm or yarn

```sh
npm install gatsby-adapter-fastify fastify
```

and add it to your `gatsby-config.js`

```js
const adapter = require("gatsby-adapter-fastify");

module.exports = {
  adapter: adapter({
    //Optional Config
  }),
};
```

# Serving your site

Node and Fastify are great for building application specific web servers but generally should not be used on the edge. Meaning, most folks will use a fully fledged web server (e.g. [Nginx](https://www.nginx.com/) or [Caddy](https://caddyserver.com/) that handles traffic before passing it back to the Node server. This edge server may handle caching, TLS/SSL, load balancing, compression, etc. Then the Node server only worries about the application. A CDN (e.g. Fastly or CloudFlare ) is also often used for performance, security, and scalability.

For these reasons, this adapter and the Fastify server it probives are focussed on hosting Gatsby, not all the edge things.

## Server CLI (expected)

This adapter implements a server that's ready to go. To use this you can configure a `start`(or whatever you prefer) command in your `package.json`:

```json
{
  "scripts": {
    "start": "gserve"
  }
}
```

### CLI Config

```
  Server
  -p, --port  Port to run the server on              [number] [default: "8080"]
  -h, --host  Host to run the server on         [string] [default: "127.0.0.1"]
  -o, --open  Open the browser                       [boolean] [default: false]

Options:
      --help      Show help                                           [boolean]
      --version   Show version number                                 [boolean]
  -l, --logLevel  set logging level
         [string] [choices: "trace", "debug", "info", "warn", "error", "fatal"]
                                                              [default: "info"]
```

All settings may be change via environment variables prefixed with `GATSBY_SERVER_` and the flag name.

```sh
# For example:
export GATSBY_SERVER_PORT=3000
export GATSBY_SERVER_HOST=0.0.0.0
# cammelCase is converted to SCREAMING_SNAKE_CASE.
export GATSBY_SERVER_LOG_LEVEL=debug
```

### Logging

For info on logging see Fastify's [documentation on logging](https://www.fastify.io/docs/latest/Reference/Logging/).

## Fastify Server Options

// TODO: Solve this problem in the future

## Features

We provide any features made possible by the [Gatsby Adapters](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/adapters/) spec. You may assume the feature is supported unless explicitly noted below.

### Gatsby Image CDN - ⚠️

TODO: Confirma all this
Gatsby Image CDN should generally work. Image transformations will happen post-build on the server via a function provided by Gatsby to the Fastify server. Gatsby also provides apropriate caching headers. But there is no CDN provided with this server, please use a transparent CDN of your choice (e.g. Fastly, Cloudflare).

### Gatsby Reverse Proxy

TODO: Does this still Apply?
Building on top of the `createRedirects` API Gatsby Cloud now supports reverse proxies. We've implemented this feature here as well.

```js
// gatsby-node.js
createRedirect({
  fromPath: `/docs/`,
  toPath: `https://www.awesomesite.com/docs/`,
  statusCode: 200, // The 200 is required to denote a proxy response as opposed to a redirect
});
```

> The Gatsby docs note ending the to and from paths with `*`. This is not allowed in this plugin. If included they are stripped for compatibility.

### Gatsby Redirects

// NOTE - There are routes that match both page and redirect. Pages take precedence over redirects so the redirect will not work:

- page: "/routes/redirect/existing" and redirect: "/routes/redirect/existing" -> "/routes/redirect/hit"

TODO: Does this still apply?
We support the use of `statusCode` but do not currently support `conditions`, `ignoreCase`, or `force` as discussed in the [`createRedirect` docs](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createRedirect).

For various reasons discussed in [this article](https://kinsta.com/knowledgebase/307-redirect/), the `isPermanent` boolean toggles HTTP `307 Temporray Redirect` and `308 Permanent Redirect` instead of `301 Moved Permanently` and `302 Found`. If you need to use `statusCode` onyour redirects to explicitly set the response code.

Our implementation supports dynamic redirects as shown by [Gatsby Cloud Docs](https://www.gatsbyjs.com/docs/how-to/cloud/working-with-redirects-and-rewrites/).

Basic, splat, wildcard, and Querystring splat redirects should all work. e.g. :

```js
createRedirect({
  fromPath: "/perm-redirect",
  toPath: "/posts/page-1",
});
createRedirect({
  fromPath: "/redirect/:letter", // `/redirect/a`
  toPath: "/app/:letter", // `/app/a`
});
createRedirect({
  fromPath: "/redirect-query?example=:example", // `/redirect-query?example=test`
  toPath: "/app/:example", // `/app/test`
});
createRedirect({
  fromPath: "/redirect-query-query?example=:example", // `/redirect-query-query?example=test`
  fromPath: "/redirect-query-query?example=:example", // `/app?example=test`
  toPath: "/app?example=:example",
});
createRedirect({
  fromPath: "/redirect-all/*", // `/redirect-all/example`
  toPath: "/app/*", // `/app/example`
});
createRedirect({
  fromPath: "/redirect-all2/*", // `/redirect-all2/abc/124` | `/redirect-all2/abc/152`
  toPath: "/app/", // `/app/`
});
```

Due to router diferences we have to handle non-splat style query string redirects specially. But they cannot be combined with splat or wildcard routes e.g.

```js
// This works
createRedirect({
  fromPath: "/redirect-query-specific?id=2",
  toPath: "/file.pdf",
});

// These will not work
createRedirect({
  fromPath: "/redirect-query-specific?id=2&example=:example",
  toPath: "/:example/file.pdf",
});
createRedirect({
  fromPath: "/redirect-query-specific/*?id=2",
  toPath: "/*file.pdf",
});
```

> **Note:** While these combos don't currently work it's not imposible to implement such a feature. If you need this feature please consider contributing.

### Gatsby Functions

TODO: HOw do handle this going forward?

Gatsby's [function docs](https://www.gatsbyjs.com/docs/reference/functions/getting-started/) suggest that the `Request` and `Response` objects for your Gatsby functions will be _Express like_ and provide the types from the Gatsby core for these.

> **THIS IS NOT TRUE FOR THIS PLUGIN**

Because we're not using Express or Gatsby's own cloud offering functions will need to use Fastify's own [`Request`](https://www.fastify.io/docs/latest/Reference/Request/) and [`Reply`](https://www.fastify.io/docs/latest/Reference/Reply/) API.

```ts
import type { FastifyRequest, FastifyReply } from "fastify";

export default function handler(req: FastifyRequest, res: FastifyReply) {
  res.send(`I am TYPESCRIPT`);
}
```
