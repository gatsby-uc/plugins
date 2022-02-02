# gatsby-plugin-vanilla-extract

Gatsby plugin which wraps the [vanilla-extract](https://vanilla-extract.style/) project for easy use in Gatsby.

## Setup

```shell
npm install gatsby-plugin-vanilla-extract @vanilla-extract/babel-plugin @vanilla-extract/css @vanilla-extract/webpack-plugin
```

Add to your site's `gatsby-config.js`.

```js
module.exports = {
  plugins: [`gatsby-plugin-vanilla-extract`],
};
```

You can also pass any [vanilla-extract configuration object](https://vanilla-extract.style/documentation/setup/#configuration) to the plugin.

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-vanilla-extract`,
      options: {
        identifiers: `short`,
      },
    },
  ],
};
```

## How to use

See the [vanilla-extract website](https://vanilla-extract.style/) for full documentation.

`src/pages/index.tsx`:

```tsx
import * as React from "react";

import { className } from "../styles/index.css.ts";

export default function Index() {
  return <div className={className}>Pizza</div>;
}
```

`src/styles/index.css.ts`:

```ts
import { style } from "@vanilla-extract/css";

export const className = style({
  background: "red",
});
```

### Example Project

Kick off your project using Gatsby's [example project](https://github.com/gatsbyjs/gatsby/tree/master/examples/using-vanilla-extract)

## Useful Links

- [TypeScript & Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [vanilla-extract website](https://vanilla-extract.style/)
- [Talk/Video Explanation](https://www.youtube.com/watch?v=23VqED_kO2Q)
