# gatsby-source-strapi

## 3.0.4

### Patch Changes

- [#365](https://github.com/gatsby-uc/plugins/pull/365) [`369749a`](https://github.com/gatsby-uc/plugins/commit/369749a50931bc073ba25815dc6d1e6561de28de) Thanks [@moonmeister](https://github.com/moonmeister)! - chore(babel): update build tooling

- [#359](https://github.com/gatsby-uc/plugins/pull/359) [`b91e945`](https://github.com/gatsby-uc/plugins/commit/b91e945ebb0a25249f8432fa682bd771407c3b04) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 3.0.3

### Patch Changes

- [#353](https://github.com/gatsby-uc/plugins/pull/353) [`56b0306`](https://github.com/gatsby-uc/plugins/commit/56b0306e48b265d29f4fb665727a002c79bc34b0) Thanks [@whidy](https://github.com/whidy)! - feat(gatsby-source-strapi): add a customized headers options that gatsby could request a remote file which may need authorization. Related to #341

## 3.0.2

### Patch Changes

- [#351](https://github.com/gatsby-uc/plugins/pull/351) [`3029c4b`](https://github.com/gatsby-uc/plugins/commit/3029c4bd65bbc5bc5203c19bd93c392934518136) Thanks [@moonmeister](https://github.com/moonmeister)! - When plugins are nested inside a Gatsby Theme they are required to have an `index.js` file in the package root. We recently removed these not knowing this requirement. Files restored and tests added.

## 3.0.1

### Patch Changes

- [#345](https://github.com/gatsby-uc/plugins/pull/345) [`65fd3f2`](https://github.com/gatsby-uc/plugins/commit/65fd3f28db83a8db0070eb8b041b212a28f5e46b) Thanks [@laurenskling](https://github.com/laurenskling)! - Fix incorectly named variable `options_` to `options` after being introduced ing rewriting the codebase with new linting rules while releasing 3.0.0

## 3.0.0

### Major Changes

- [#331](https://github.com/gatsby-uc/plugins/pull/331) [`5eed071`](https://github.com/gatsby-uc/plugins/commit/5eed0719437c457c3ab54ee1f261d3d62cd6beae) Thanks [@laurenskling](https://github.com/laurenskling)! - The Strapi company has [decided](https://github.com/gatsby-uc/gatsby-source-strapi/issues/352#issuecomment-1349139258) to transfer maintenance for `gatsby-source-strapi` to the community. The [Gatsby User Collective](https://github.com/gatsby-uc/plugins) has taken upon itself the task to maintain and release this plugin from now on.

  Changes made:

  - We've merged in https://github.com/gatsby-uc/gatsby-source-strapi/pull/289 allowing contentTypes from plugins to be fetched
  - We've added peerDependencies for Gatsby 5
  - The code has been altered to match GUC's prettier and linting rules

  Because of these changes, in ownership and in code, we've released this version as a major. It should not contain any breaking changes and upgrading should be possible without any issues.

  Are you dependent on this plugin? Come join us and help grow this plugin as a maintainer.
