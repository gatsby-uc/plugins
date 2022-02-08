# gatsby-plugin-vanilla-extract

## 2.0.1

### Patch Changes

- [#171](https://github.com/gatsby-uc/plugins/pull/171) [`466783c`](https://github.com/gatsby-uc/plugins/commit/466783cd5c0ae112b7ff5aaedbad987cc3896fdf) Thanks [@LekoArts](https://github.com/LekoArts)! - Update README to include links to an example and further learning material.

## 2.0.0

### Major Changes

- [#148](https://github.com/gatsby-uc/plugins/pull/148) [`732226d`](https://github.com/gatsby-uc/plugins/commit/732226d3947f27d7d53065fb6a3c1e1d8376fe53) Thanks [@marvinjude](https://github.com/marvinjude)! - This moves the repository from [KyleAMathews/gatsby-plugin-vanilla-extract](https://github.com/KyleAMathews/gatsby-plugin-vanilla-extract) to [gatsby-uc/plugins](https://github.com/gatsby-uc/plugins) to help with better maintenance on the plugin itself.

  There was also a breaking change made to the plugin: The `vanilla-extract` dependencies are now marked as `peerDependencies` and not bundled with the plugin anymore.

  In order to migrate, run the following in your terminal:

  ```shell
  npm install gatsby-plugin-vanilla-extract@latest @vanilla-extract/babel-plugin @vanilla-extract/css @vanilla-extract/webpack-plugin
  ```
