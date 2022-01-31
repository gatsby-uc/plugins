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

`src/styles/index.css.ts`

```ts
import { style } from "@vanilla-extract/css";

export const className = style({
  background: "red",
});
```

## Using a Starter
Kick off your project using our [Typescript starter](https://github.com/gatsbyjs/gatsby-starter-typescript
)

## Useful Links

- [TypeScript & Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
