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

## About

`gatsby-plugin-fastify` gives you a way to integrate your Gatsby site with a Node.js server using Fastify. Use to serve a standard Gatsby.js site normally - the plugin will take care of everything:

- Serving Gatsby Functions
- Serving static files
- 404 page middleware
- Gatsby redirects
- Client-side paths
- Serving the site with pathPrefix - set it up inside `gatsby-config.js`, the plugin will take care of it
- File compression, Etags, and more.

## Installation

Install the plugin using npm or yarn

```sh
npm install gatsby-plugin-fastify fastify fastify-static fastify-compress fastify-plugin fastfy-caching
```

and add it to your `gatsby-config.js`

```js
module.exports = {
  /* Site config */
  plugins: [
    /* Rest of the plugins */
    `gatsby-plugin-fastify`,
  ],
};
```

## Serving your site

### Server

This plugin implements a server that's ready to go. To use this you can configure a `start`(or whatever you prefer) command in your `package.json`:

```json
{
  "scrips": {
    "start": "node ./node_modules/gatsby-plugin-fastify/serve.js"
  }
}
```

This default's to listening on `localhost:8080`. This can be overridden by setting the `ADDRESS:PORT` environment variables respectively.

```sh
# For example:
export PORT=3000
export ADDRESS=0.0.0.0
```

### Gatsby Fastify Plugin

This plugin also implements a Fastify plugin for serving Gatsby. This may be imported via:

```js
import { serveGatsby } from "gatsby-plugin-fastify/plugins/gatsby";
```

For an example on how to use this you can copy the server implementation file from [`src/serve.ts`](https://github.com/gatsby-uc/plugins/tree/main/packages/gatsby-plugin-fastify/src/serve.ts).

### Gatsby Feature Fastify Plugins

Finally, each of the Gatsby features (functions, static files, redirects, client-only routes, and 404 handling) is implemented in it's own plugin. Those may be imported as well for use in a custom server implementation.

```js
import { handle } from "gatsby-plugin-fastify/plugins/gatsby";
import { handle404 } from "gatsby-plugin-fastify/plugins/404";
import { handleClientOnlyPaths } from "gatsby-plugin-fastify/plugins/clientPaths";
import { handleFunctions } from "gatsby-plugin-fastify/plugins/functions";
import { handleRedirects } from "gatsby-plugin-fastify/plugins/redirects";
import { handleStatic } from "gatsby-plugin-fastify/plugins/static";
```

For an example on how to use these you can copy the `serveGatsby` implementation file from [`src/plugins/gatsby.ts`](https://github.com/gatsby-uc/plugins/tree/main/packages/gatsby-plugin-fastify/src/plugins/gatsby.ts).

## Gatsby Functions

Gatsby's [function docs](https://www.gatsbyjs.com/docs/reference/functions/getting-started/) suggest that the `Request` and `Response` objects for your Gatsby functions will be _Express like_ and provide the types from the Gatsby core for these.

> THIS IS NOT TRUE FOR THIS PLUGIN

Because we're not using Express or Gatsby's own cloud offering functions will need to use Fastify's own [`Request`](https://www.fastify.io/docs/latest/Request/) and [`Reply`](https://www.fastify.io/docs/latest/Reply/) API.

If you'd like to use Fastify with an _Express like_ API there are plugins for Fastify to do this, see their [docs on middleware](https://www.fastify.io/docs/latest/Middleware/). You'll need to use the exports provided in this package to write your own server implementation and add the correct plugins to support this.

## TypeScript

```ts
import type { FastifyRequest, FastifyReply } from "fastify";

export default function handler(req: FastifyRequest, res: FastifyReply) {
  res.send(`I am TYPESCRIPT`);
}
```

## Features you could help with

- [x] Support for creating pathPrefix
- [x] Fastify 3.x support
- [x] Compression support
- [x] Proper file caching
- [ ] Proper CLI w/
  - [ ] flags to set port/address
  - [ ] export command to copy out server implementation
- [ ] Plugin config
  - [ ] enable/disable certain features
  - [ ] control security headers
  - [ ] control caching headers
- [ ] Export types
- [ ] If the site isn't built when server is launched, build it automatically
- [ ] Security headers/control
- [ ] Proper testing
