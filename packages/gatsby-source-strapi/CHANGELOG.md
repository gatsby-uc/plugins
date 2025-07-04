# gatsby-source-strapi

## 5.0.4

### Patch Changes

- [#515](https://github.com/gatsby-uc/plugins/pull/515) [`f15ad07`](https://github.com/gatsby-uc/plugins/commit/f15ad079f3bcb719396c98f7e71e12603f3d027c) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 5.0.3

### Patch Changes

- [#511](https://github.com/gatsby-uc/plugins/pull/511) [`e51e8d9`](https://github.com/gatsby-uc/plugins/commit/e51e8d9e6f65c5bd67d32fd759d530cc8b521f66) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 5.0.2

### Patch Changes

- [#503](https://github.com/gatsby-uc/plugins/pull/503) [`c0cd977`](https://github.com/gatsby-uc/plugins/commit/c0cd9774e0c8c46c5dffeeb718e46ca7274c3b80) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 5.0.1

### Patch Changes

- [#500](https://github.com/gatsby-uc/plugins/pull/500) [`11168f4`](https://github.com/gatsby-uc/plugins/commit/11168f4af88ad030f1f329fc5d8cf4fe30785015) Thanks [@laurenskling](https://github.com/laurenskling)! - reduce the queryLimit to Strapi default 100

## 5.0.0

### Major Changes

- [#498](https://github.com/gatsby-uc/plugins/pull/498) [`10ed235`](https://github.com/gatsby-uc/plugins/commit/10ed235b1b1dd6501122f78f1ef40a192e8e6793) Thanks [@laurenskling](https://github.com/laurenskling)! - BREAKING CHANGES:
  - This plugin now assumes Strapi 5 by default. If you are on Strapi 4, set `version: 4` in your plugin options, see the [readme](https://github.com/gatsby-uc/plugins/tree/main/packages/gatsby-source-strapi)
  - Previously `strapi_id` was filled with the `documentId`, now `strapi_id` will be the regular `id`.

  `documentId` is now added as a field.
  `strapi_document_id_or_regular_id` contains a mixture of the both. `documentId`'s when they are available, `id`'s for content without a `documentId` (for example media or components).

  If you use `strapi_id` in your code assuming it is a Strapi 5 `documentId`, you have to rewrite that code to use the `documentId` field. More info why [in the PR](https://github.com/gatsby-uc/plugins/pull/498)

## 4.0.1

### Patch Changes

- [#469](https://github.com/gatsby-uc/plugins/pull/469) [`4759545`](https://github.com/gatsby-uc/plugins/commit/475954526a982c149696255f7ddfb3dba60e17b5) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#484](https://github.com/gatsby-uc/plugins/pull/484) [`2579b64`](https://github.com/gatsby-uc/plugins/commit/2579b64b1bbf62df71fd3717486c600161f8b307) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling to v7.25.8

- [#468](https://github.com/gatsby-uc/plugins/pull/468) [`67b7397`](https://github.com/gatsby-uc/plugins/commit/67b73976f7606fed7653e26150d4a7bab092935f) Thanks [@renovate](https://github.com/apps/renovate)! - Refactor code for updated linting rules

- [#466](https://github.com/gatsby-uc/plugins/pull/466) [`3731300`](https://github.com/gatsby-uc/plugins/commit/3731300946af4aeed7caf052cea62886941f8c82) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

## 4.0.0

### Major Changes

- [#478](https://github.com/gatsby-uc/plugins/pull/478) [`5ee9975`](https://github.com/gatsby-uc/plugins/commit/5ee997549f9a99056bf6d627d950a8ca859f1b0d) Thanks [@laurenskling](https://github.com/laurenskling)! - Support Strapi v5, while staying compatible with v4.

  There are no breaking changes. I've created a major release because I don't want to bother current applications with possible bugs. Updrading to this code should be a choice.

  I have removed the code for creating the unstable_createNodeManifest. In my believe, this was only for Gatsby Cloud and as Gatsby Cloud only remains in our sweet memories of the glory days, we don't need it anymore. I've also deleted the readme about Gatsby Cloud and content sync, I don't believe any plaform is supporting content sync right now, or ever again.

  I have tried to support both v4 and v5 syntaxes in this release. By setting `version` on your config to 5, the new REST API syntax will be used. `publicationState=preview` will automatically be rewritten to `status=draft`.

  As Strapi v5 is using documentId's over regular id's, I am now using the documentId (where available, f.e. not in components) to create the Gatsby Node id. This should keep updated relations intact when reloading data.

## 3.3.3

### Patch Changes

- [#464](https://github.com/gatsby-uc/plugins/pull/464) [`c43c4d8`](https://github.com/gatsby-uc/plugins/commit/c43c4d86a4d787415b7efd830b9b1620ae4df989) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#450](https://github.com/gatsby-uc/plugins/pull/450) [`f334dd4`](https://github.com/gatsby-uc/plugins/commit/f334dd4a79868cef3dc03534baa27e95e36760c8) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling to v7.23.7

## 3.3.2

### Patch Changes

- [#461](https://github.com/gatsby-uc/plugins/pull/461) [`caf7d4f`](https://github.com/gatsby-uc/plugins/commit/caf7d4feb52b9ca062b0d78883659d62e86243f4) Thanks [@moonmeister](https://github.com/moonmeister)! - Updated can-i-use database

- [#461](https://github.com/gatsby-uc/plugins/pull/461) [`caf7d4f`](https://github.com/gatsby-uc/plugins/commit/caf7d4feb52b9ca062b0d78883659d62e86243f4) Thanks [@moonmeister](https://github.com/moonmeister)! - - Updated testing and runners to latest Node 20 LTS.
  - Updated to latests Yarn v4 and corepack for management of packageManager. Please run `corepack enable` to use the correct version of `yarn`.
  - Updated dependencies.
  - Updated prettier and associated formatting.
  - Update TypeScript versions used to latest.

- [#444](https://github.com/gatsby-uc/plugins/pull/444) [`b7b48b7`](https://github.com/gatsby-uc/plugins/commit/b7b48b781885a7b0378bb44f18ee18b0733a3981) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#453](https://github.com/gatsby-uc/plugins/pull/453) [`6a313dc`](https://github.com/gatsby-uc/plugins/commit/6a313dca5b1f7f71a2a7ef8c19aef7e72e5f7445) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 3.3.1

### Patch Changes

- [#442](https://github.com/gatsby-uc/plugins/pull/442) [`dd33f3d`](https://github.com/gatsby-uc/plugins/commit/dd33f3d91ef83c0c463e317be836c300f8427d21) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

## 3.3.0

### Minor Changes

- [#430](https://github.com/gatsby-uc/plugins/pull/430) [`23f9fba`](https://github.com/gatsby-uc/plugins/commit/23f9fba42e854a86874545c4fce2be2858133c5f) Thanks [@tboutron](https://github.com/tboutron)! - Fix homepage link for plugins

### Patch Changes

- [#418](https://github.com/gatsby-uc/plugins/pull/418) [`c6b3c08`](https://github.com/gatsby-uc/plugins/commit/c6b3c084c542b24ed0e953005f394fdb62396465) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#414](https://github.com/gatsby-uc/plugins/pull/414) [`badae40`](https://github.com/gatsby-uc/plugins/commit/badae403b130fd3bdf8d706c540d14de884c8490) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

## 3.2.0

### Minor Changes

- [#411](https://github.com/gatsby-uc/plugins/pull/411) [`016caf1`](https://github.com/gatsby-uc/plugins/commit/016caf17372c5623f98b88846ebe9299bf7fe796) Thanks [@konsalex](https://github.com/konsalex)! - upgrade axios to v1

## 3.1.4

### Patch Changes

- [#413](https://github.com/gatsby-uc/plugins/pull/413) [`30880d5`](https://github.com/gatsby-uc/plugins/commit/30880d508a36b7b7958b3fa9a7770cff0b050ce9) Thanks [@xSyki](https://github.com/xSyki)! - singleTypes return a 404 when it isn't updated since the latest fetch. Therefor, errors would be silenced. Fix this to report errors that are not 404

- [#397](https://github.com/gatsby-uc/plugins/pull/397) [`de090f0`](https://github.com/gatsby-uc/plugins/commit/de090f0dd500e811b1345555c16a5f68c8f71c94) Thanks [@konsalex](https://github.com/konsalex)! - add `maxParallelRequests` config option for users to provide, and refactor to use a single axios instance to all functions

## 3.1.3

### Patch Changes

- [#408](https://github.com/gatsby-uc/plugins/pull/408) [`92f7486`](https://github.com/gatsby-uc/plugins/commit/92f748667ddbbeb4ec72dfab7808e81cc1b98f82) Thanks [@laurenskling](https://github.com/laurenskling)! - No need for JSON.stringify when results are already String

## 3.1.2

### Patch Changes

- [#406](https://github.com/gatsby-uc/plugins/pull/406) [`9a51a78`](https://github.com/gatsby-uc/plugins/commit/9a51a7825caebeb6c9af0a34ffb46aa19d9aa003) Thanks [@laurenskling](https://github.com/laurenskling)! - add paramsSerializer to singleType reporter info

## 3.1.1

### Patch Changes

- [#404](https://github.com/gatsby-uc/plugins/pull/404) [`f5471bc`](https://github.com/gatsby-uc/plugins/commit/f5471bcaaade77037561d8e6288e0ce038cf1700) Thanks [@laurenskling](https://github.com/laurenskling)! - Revert "fix(packages): update dependency axios to v1"

## 3.1.0

### Minor Changes

- [#362](https://github.com/gatsby-uc/plugins/pull/362) [`f6c5b3a`](https://github.com/gatsby-uc/plugins/commit/f6c5b3a0d91b7817115a0794ade2685e0a43467e) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update dependency axios to v1
  Thanks to @konsalex for some manual testing. Due to the lack of automated tests we cannot guarantee this update won't break anything, please report any issues you may run into.

### Patch Changes

- [#399](https://github.com/gatsby-uc/plugins/pull/399) [`9a562d8`](https://github.com/gatsby-uc/plugins/commit/9a562d82db14048c698d2f0a009fe76ec48320a7) Thanks [@laurenskling](https://github.com/laurenskling)! - fix(gatsby-source-strapi) make sure the pagination is not mutated when refetching

## 3.0.6

### Patch Changes

- [#395](https://github.com/gatsby-uc/plugins/pull/395) [`0b324dd`](https://github.com/gatsby-uc/plugins/commit/0b324dd7c5391457043974e257d9cf837810f8aa) Thanks [@KyleAMathews](https://github.com/KyleAMathews)! - Update Strapi README noting need for local IP address instead of 'localhost'

## 3.0.5

### Patch Changes

- [#382](https://github.com/gatsby-uc/plugins/pull/382) [`d578b78`](https://github.com/gatsby-uc/plugins/commit/d578b7896f804716a4c2222385c19be11c27bdf4) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#378](https://github.com/gatsby-uc/plugins/pull/378) [`07bbfa7`](https://github.com/gatsby-uc/plugins/commit/07bbfa7c434b8543a7d15c5f2e87ac48705aa593) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

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
