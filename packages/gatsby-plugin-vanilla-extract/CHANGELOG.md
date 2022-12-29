# gatsby-plugin-vanilla-extract

## 4.0.1

### Patch Changes

- [#351](https://github.com/gatsby-uc/plugins/pull/351) [`3029c4b`](https://github.com/gatsby-uc/plugins/commit/3029c4bd65bbc5bc5203c19bd93c392934518136) Thanks [@moonmeister](https://github.com/moonmeister)! - When plugins are nested inside a Gatsby Theme they are required to have an `index.js` file in the package root. We recently removed these not knowing this requirement. Files restored and tests added.

## 4.0.0

### Major Changes

- [#303](https://github.com/gatsby-uc/plugins/pull/303) [`bae3266`](https://github.com/gatsby-uc/plugins/commit/bae326612720b00116aea0928fc84a01a328fbb7) Thanks [@renovate](https://github.com/apps/renovate)! - Dropping Gatsby v2/v3 peer dependency support as these versions of Gatsby are EOL. Please update to a supported version of Gatsby, v4 or v5.

### Patch Changes

- [#305](https://github.com/gatsby-uc/plugins/pull/305) [`97af0d6`](https://github.com/gatsby-uc/plugins/commit/97af0d667d8f6e5265773f9cdb8eb0a184b9a6fa) Thanks [@moonmeister](https://github.com/moonmeister)! - ADded ESLint configs and updated packages to lint rules. Don't expect any functional changes but code was changed. Please open an issue if you notice any change in behavior.

## 3.0.1

### Patch Changes

- [#294](https://github.com/gatsby-uc/plugins/pull/294) [`f830e3a`](https://github.com/gatsby-uc/plugins/commit/f830e3ab2cf9dc4b6daf474ed717cd02179fd556) Thanks [@LekoArts](https://github.com/LekoArts)! - Change peerDependencies to allow Gatsby 5

## 3.0.0

### Major Changes

- [#254](https://github.com/gatsby-uc/plugins/pull/254) [`caf0984`](https://github.com/gatsby-uc/plugins/commit/caf0984985b1c27598ff897bc275bdd5edc959f5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove `@vanilla-extract/babel-plugin` from plugin

  BREAKING CHANGE

  As of `@vanilla-extract/webpack-plugin@v2.2.0` the babel plugin is no longer required. Therefore the peer dependency range has been updated to `^2.2.0`.

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
