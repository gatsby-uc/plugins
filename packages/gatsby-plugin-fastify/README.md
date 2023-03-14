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

Node and Fastify are great for building application specific web servers but generally should not be used on the edge. Meaning, most folks will use a fully fledged web server (e.g. [Nginx](https://www.nginx.com/) or [Caddy](https://caddyserver.com/) that handles traffic before passing it back to the Node server. This edge server may handle caching, TLS/SSL, load balancing, compression, etc. Then the Node server only worries about the application. A CDN (e.g. Fastly or CloudFlare ) is also often used for performance and scalability.

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
export GATSBY_SERVER_HOST=0.0.0.0
# cammelCase is converted to SCREAMING_SNAKE_CASE.
export GATSBY_SERVER_LOG_LEVEL=debug
```

### Logging

For info on logging see Fastify's [documentation on logging](https://www.fastify.io/docs/latest/Reference/Logging/).

## Fastify Server Options

You may directly [configure the Fastify server](https://www.fastify.io/docs/latest/Reference/Server/#factory) from the plugin options in Gatsby config. While many options fastify provides are safe to modify, it's very possible to break your server with these as well, test well. Outside the defaults any values passed are not type checked by Gatsby for compatibility, make sure you are passing valid values as defined in the [Fastify server factory docs](https://www.fastify.io/docs/latest/Reference/Server/#factory).

```js
module.exports = {
  /* Site config */
  plugins: [
    /* Rest of the plugins */
    {
      resolve: `gatsby-plugin-fastify`,
      /* Default option value shown */
      options: {
        fastify: {
          logger: { level: /* defaults to info by CLI params*/ },
          ignoreTralingSlash: true,
          maxParamLength: 500,
          // for complete options see https://www.fastify.io/docs/latest/Reference/Server/#factory
        },
      },
    },
  ],
};
```

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

### Gatsby Image CDN (BETA)

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

### Gatsby Redirects

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

Gatsby's [function docs](https://www.gatsbyjs.com/docs/reference/functions/getting-started/) suggest that the `Request` and `Response` objects for your Gatsby functions will be _Express like_ and provide the types from the Gatsby core for these.

> **THIS IS NOT TRUE FOR THIS PLUGIN**

Because we're not using Express or Gatsby's own cloud offering functions will need to use Fastify's own [`Request`](https://www.fastify.io/docs/latest/Reference/Request/) and [`Reply`](https://www.fastify.io/docs/latest/Reference/Reply/) API.

```ts
import type { FastifyRequest, FastifyReply } from "fastify";

export default function handler(req: FastifyRequest, res: FastifyReply) {
  res.send(`I am TYPESCRIPT`);
}
```

### Gatsby Routing

We have implemented a compatability layer to support the Gatsby flavor of routing for [Gatsby Functions](https://www.gatsbyjs.com/docs/reference/functions/routing/) and [File System Routing API](https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/#syntax-client-only-routes). This should be transparent and if you follow the Gatsby docs for routing we should now support all those modes. This very well might not be perfect, if you have issues with routing please file a bug with a reproduction.

### Headers

Sensible default security headers are added to all files/paths. These headers include:

- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: same-origin

Headers for user-defined path patterns can be added/overwritten via `options.features.headers.customHeaders`.

We use [picomatch](https://www.npmjs.com/package/picomatch) for pattern matching. [Globbing](https://www.npmjs.com/package/picomatch#basic-globbing) can be used to match paths. For example, to add headers to all posts with a URL structure such as `/posts/category-name/post-name` you would use a pattern like `/posts/**`.  `/posts/*`, with a single asterisk, would only match the second level sub-directory after `/posts/` (in this case the `category-name`), not the third level where the posts reside.

```
{
	resolve: `gatsby-plugin-fastify`,
	options: {
		features: {
			headers: {
				useDefaultCaching: true, // default: true
				useDefaultSecurity: true, // default: true
				customHeaders: {
					"/posts/**": { // all categories and posts
						"x-test": "post",
					},
					"/posts/fun-stuff/trampolines": { // just the trampoline post
						"x-test": "trampoline post",
					},
				},
			},
		},
	},
},
```

As in the example above, successive matching entries in `customHeaders` will overwrite previous matches. This successive overwriting includes overwriting the default caching and default security headers if you are including them via `options.features.headers.useDefaultCaching` and/or `options.features.headers.useDefaultSecurity` which are both `true` by default.

For SSR pages, headers configured in `options.features.headers.customHeaders` will be added to the matching routes alongside headers returned from `getServerData`. If both places set the same header the value in `getServerData` will take precedence.
