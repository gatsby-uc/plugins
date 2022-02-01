---
"gatsby-plugin-vanilla-extract": major
---

This moves the repository from [KyleAMathews/gatsby-plugin-vanilla-extract](https://github.com/KyleAMathews/gatsby-plugin-vanilla-extract) to [gatsby-uc/plugins](https://github.com/gatsby-uc/plugins) to help with better maintenance on the plugin itself.

There was also a breaking change made to the plugin: The `vanilla-extract` dependencies are now marked as `peerDependencies` and not bundled with the plugin anymore.

In order to migrate, run the following in your terminal:

```shell
npm install gatsby-plugin-vanilla-extract@latest @vanilla-extract/babel-plugin @vanilla-extract/css @vanilla-extract/webpack-plugin
```
