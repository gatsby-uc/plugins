---
"gatsby-plugin-fastify": minor
---

FEAT: Added ability to configure Fastify server options from plugin config. As a part of this effort several non-critical defaults have been changed. While debating this change it was relized these defaults were more for development ease than good production defaults.

1. Request logging is now on by default as is normal in Fastify.
2. Logging is no longer "pretty" when `NODE_ENV=development`.

If you'd like to restore either of the functionalities see:

```js
//gatsby-config.js
module.exports = {
  /* Site config */
  plugins: [
    /* Rest of the plugins */
    {
      resolve: `gatsby-plugin-fastify`,
      /* Default option value shown */
      options: {
        fastify: {
          logger: {
            level: logLevel,
            transport:
              process.env.NODE_ENV === "development"
                ? {
                    target: "pino-pretty",
                    options: {
                      translateTime: "HH:MM:ss Z",
                      ignore: "pid,hostname",
                    },
                  }
                : undefined,
          },
          disableRequestLogging: ["trace", "debug"].includes(logLevel) ? false : true,
        },
      },
    },
  ],
};
```

> To restore pretty printing you'll also need to install `pino-pretty` from npm.
