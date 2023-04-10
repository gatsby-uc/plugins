# gatsby-source-strapi

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
