# gatsby-source-strapi

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
