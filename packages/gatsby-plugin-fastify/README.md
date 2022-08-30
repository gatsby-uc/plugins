<p align="center">
  <img src="https://github.com/gatsby-uc/plugins/raw/HEAD/packages/gatsby-plugin-fastify/logo.png" alt="Gatsby + Fastify"/>
</p>
<p align="center">
  <h2 align="center">gatsby-plugin-fastify</h2>
</p>
<p align="center">
  <i>
    Gatsby plugin for easy integration with Fastify.
  </i>
</p>
<p align="center">
  <img alt="MIT License" src="https://img.shields.io/github/license/gatsby-uc/plugins?style=flat-square">
  <img alt="NPM version" src="https://img.shields.io/npm/v/gatsby-plugin-fastify?style=flat-square">
  <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/gatsby-plugin-fastify/peer/fastify?style=flat-square">
  <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/gatsby-plugin-fastify/peer/gatsby?style=flat-square">
</p>

# About

`gatsby-plugin-fastify` gives you a way to integrate your Gatsby site with a Node.js server using Fastify. Use to serve a standard Gatsby.js site normally - the plugin will take care of everything:

- Serving [Gatsby Functions](https://www.gatsbyjs.com/docs/reference/functions/)
- Serving [static files](https://www.gatsbyjs.com/docs/caching/#static-files)
- Serving [DSG](https://www.gatsbyjs.com/docs/reference/rendering-options/deferred-static-generation/)/[SSR](https://www.gatsbyjs.com/docs/reference/rendering-options/server-side-rendering/) Routes
- Gatsby [404 page](https://www.gatsbyjs.com/docs/how-to/adding-common-features/add-404-page/)
- Gatsby [500 page](https://www.gatsbyjs.com/docs/how-to/adding-common-features/add-500-page/)
- Gatsby [redirects](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createRedirect)
- Gatsby [reverse proxy](https://support.gatsbyjs.com/hc/en-us/articles/1500003051241-Working-with-Redirects-and-Rewrites)
- [Client-only routes](https://www.gatsbyjs.com/docs/how-to/routing/client-only-routes-and-user-authentication)
- Serving the site with [pathPrefix](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/) - set it up inside `gatsby-config.js`, the plugin will take care of it
- Etags, and more.

# Installation

Install the plugin using npm or yarn

```sh
npm install gatsby-plugin-fastify fastify
```

and add it to your `gatsby-config.js`

```js
module.exports = {
  /* Site config */
  plugins: [
    /* Rest of the plugins */
    {
      resolve: `gatsby-plugin-fastify`,
      options: {
        /* discussed below */
      }, // All options are optional
    },
  ],
};
```

# Serving your site

Node and Fastify are great for building application specific web servers but generally should not be used on the edge. Meaning, most folks will use a fully fledged web server (e.g. [Nginx](https://www.nginx.com/) or [Caddy](https://caddyserver.com/) that handles traffic before passing it back to the Node server. This edge server may handle caching, TLS/SSL, load balancing, compression, etc. Then the Node server only worries about the application. A CDN (e.g. Fastly or CloudFlare ) is also often used for performance and scalability and may be use in place of the edge server, though this may be less secure.

## Server CLI (expected)

This plugin implements a server that's ready to go. To use this you can configure a `start`(or whatever you prefer) command in your `package.json`:

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
export GATSBY_SERVER_ADDRESS=0.0.0.0
export GATSBY_SERVER_LOG_LEVEL=debug
```

### Logging

By default only basic info is logged along with warnings or errors. By setting the logging level to `debug` you'll also enable Fastify's default [request logging](https://www.fastify.io/docs/latest/Logging/) which is usually enabled for the `info` level.

## Features

Some features can be disabled through the plugin options. This will not provide increased performance but is probided as an option to control features in certain deploys or to handoff certain features to an edge server or CDN as desired.

```js
module.exports = {
  /* Site config */
  plugins: [
    /* Rest of the plugins */
    {
      resolve: `gatsby-plugin-fastify`,
      /* Default option value shown */
      options: {
        features: {
          redirects: true,
          reverseProxy: true,
          imageCdn: false, // Feature in Beta, use with caution
        },
      },
    },
  ],
};
```

## Gatsby Image CDN (BETA)

> **BETA:** This feature is under going active development to fix bugs and extend functionality by the Gatsby team. I'm releasing this feature here with compatability for `gatsby@4.12.1`, `gatsby-source-wordpres@6.12.1`, and `gatsby-source-contentful@7.10.0` No guarantee it works on newer or older versions.

While not strictly a CDN in our case this still implements the ability for Images to be transformed outside of build time.

> Please note that this writes generated images to the `/public/\_gatsby folder. This must be writeable in production.

This will be enabled by default if your version of Gatsby supports the image CDN. You may manually disable it in the config if you don't need it.

### Gatsby Reverse Proxy

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

### Gatsby Functions

Gatsby's [function docs](https://www.gatsbyjs.com/docs/reference/functions/getting-started/) suggest that the `Request` and `Response` objects for your Gatsby functions will be _Express like_ and provide the types from the Gatsby core for these.

> **THIS IS NOT TRUE FOR THIS PLUGIN**

Because we're not using Express or Gatsby's own cloud offering functions will need to use Fastify's own [`Request`](https://www.fastify.io/docs/latest/Reference/Request/) and [`Reply`](https://www.fastify.io/docs/latest/Reference/Reply/) API.

### TypeScript

```ts
import type { FastifyRequest, FastifyReply } from "fastify";

export default function handler(req: FastifyRequest, res: FastifyReply) {
  res.send(`I am TYPESCRIPT`);
}
```
