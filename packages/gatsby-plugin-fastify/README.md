<p align="center">
  <img src="https://github.com/gatsby-uc/plugins/raw/HEAD/logo.png" alt="Gatsby + Fastify"/>
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
  <img src="https://img.shields.io/github/license/adamsiekierski/gatsby-plugin-nodejs?style=flat-square">
  <img src="https://img.shields.io/david/adamsiekierski/gatsby-plugin-nodejs?style=flat-square">
  <img src="https://img.shields.io/github/package-json/v/moonmeister/gatsby-plugin-nodejs?style=flat-square">
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

## Gatsby Fastify Plugin

This plugin also implements a plugin for Gatsby. This may be imported via:

```js
import { serveGatsby } from "gatsby-plugin-fastify/plugins/gatsby";
```

For an example on how to use this you can copy the server implementation file from (`src/serve.ts`)[https://github.com/gatsby-uc/plugins/tree/main/packages/gatsby-plugin-fastify/src/serve.ts].

## Gatsby Feature Fastify Plugins

Finally, Each of the Gatsby features (functions, static files, redirects, client-only routes, and 404 handling) is implemented in it's own plugin Those may be imported as well for use in a custom server implementation.

```js
import { handle } from "gatsby-plugin-fastify/plugins/gatsby";
import { handle404 } from "gatsby-plugin-fastify/plugins/404";
import { handleClientOnlyPaths } from "gatsby-plugin-fastify/plugins/clientPaths";
import { handleFunctions } from "gatsby-plugin-fastify/plugins/functions";
import { handleRedirects } from "gatsby-plugin-fastify/plugins/redirects";
import { handleStatic } from "gatsby-plugin-fastify/plugins/static";
```

For an example on how to use these you can copy the `serveGatsby` implementation file from (`src/plugins/gatsby.ts`)[https://github.com/gatsby-uc/plugins/tree/main/packages/gatsby-plugin-fastify/src/plugins/gatsby.ts].

## Gatsby Functions

Gatsby's [function docs](https://www.gatsbyjs.com/docs/reference/functions/getting-started/) suggest that the `Request` and `Response` objects for your Gatsby functions will be **Express like** and provide the types from the Gatsby core for these.

> THIS IS NOT RUE FO RTHIS PLUGIN

Because we're not using Express or Gatsby's own cloud offering functions will need to use Fastify's own [`Request`](https://www.fastify.io/docs/latest/Request/) and [`Reply`](https://www.fastify.io/docs/latest/Reply/) API.

### TypeScript

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
- [ ] Propper file caching
- [ ] Export types
- [ ] If the site isn't built when server is launched, build it automatically
- [ ] Security headers/control
