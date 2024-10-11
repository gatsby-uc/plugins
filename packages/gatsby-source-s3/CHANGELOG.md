# gatsby-source-s3

## 4.1.4

### Patch Changes

- [#485](https://github.com/gatsby-uc/plugins/pull/485) [`25b0c04`](https://github.com/gatsby-uc/plugins/commit/25b0c04473de2e31894725c97fd70767742e8905) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions to ^3.669.0

- [#469](https://github.com/gatsby-uc/plugins/pull/469) [`4759545`](https://github.com/gatsby-uc/plugins/commit/475954526a982c149696255f7ddfb3dba60e17b5) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#484](https://github.com/gatsby-uc/plugins/pull/484) [`2579b64`](https://github.com/gatsby-uc/plugins/commit/2579b64b1bbf62df71fd3717486c600161f8b307) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling to v7.25.8

- [#466](https://github.com/gatsby-uc/plugins/pull/466) [`3731300`](https://github.com/gatsby-uc/plugins/commit/3731300946af4aeed7caf052cea62886941f8c82) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

## 4.1.3

### Patch Changes

- [#464](https://github.com/gatsby-uc/plugins/pull/464) [`c43c4d8`](https://github.com/gatsby-uc/plugins/commit/c43c4d86a4d787415b7efd830b9b1620ae4df989) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#450](https://github.com/gatsby-uc/plugins/pull/450) [`f334dd4`](https://github.com/gatsby-uc/plugins/commit/f334dd4a79868cef3dc03534baa27e95e36760c8) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling to v7.23.7

## 4.1.2

### Patch Changes

- [#461](https://github.com/gatsby-uc/plugins/pull/461) [`caf7d4f`](https://github.com/gatsby-uc/plugins/commit/caf7d4feb52b9ca062b0d78883659d62e86243f4) Thanks [@moonmeister](https://github.com/moonmeister)! - Updated can-i-use database

- [#461](https://github.com/gatsby-uc/plugins/pull/461) [`caf7d4f`](https://github.com/gatsby-uc/plugins/commit/caf7d4feb52b9ca062b0d78883659d62e86243f4) Thanks [@moonmeister](https://github.com/moonmeister)! - - Updated testing and runners to latest Node 20 LTS.

  - Updated to latests Yarn v4 and corepack for management of packageManager. Please run `corepack enable` to use the correct version of `yarn`.
  - Updated dependencies.
  - Updated prettier and associated formatting.
  - Update TypeScript versions used to latest.

- [#444](https://github.com/gatsby-uc/plugins/pull/444) [`b7b48b7`](https://github.com/gatsby-uc/plugins/commit/b7b48b781885a7b0378bb44f18ee18b0733a3981) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#453](https://github.com/gatsby-uc/plugins/pull/453) [`6a313dc`](https://github.com/gatsby-uc/plugins/commit/6a313dca5b1f7f71a2a7ef8c19aef7e72e5f7445) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 4.1.1

### Patch Changes

- [#442](https://github.com/gatsby-uc/plugins/pull/442) [`dd33f3d`](https://github.com/gatsby-uc/plugins/commit/dd33f3d91ef83c0c463e317be836c300f8427d21) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

## 4.1.0

### Minor Changes

- [#430](https://github.com/gatsby-uc/plugins/pull/430) [`23f9fba`](https://github.com/gatsby-uc/plugins/commit/23f9fba42e854a86874545c4fce2be2858133c5f) Thanks [@tboutron](https://github.com/tboutron)! - Fix homepage link for plugins

### Patch Changes

- [#418](https://github.com/gatsby-uc/plugins/pull/418) [`c6b3c08`](https://github.com/gatsby-uc/plugins/commit/c6b3c084c542b24ed0e953005f394fdb62396465) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#414](https://github.com/gatsby-uc/plugins/pull/414) [`badae40`](https://github.com/gatsby-uc/plugins/commit/badae403b130fd3bdf8d706c540d14de884c8490) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

## 4.0.0

### Major Changes

- [#387](https://github.com/gatsby-uc/plugins/pull/387) [`a0cfd0b`](https://github.com/gatsby-uc/plugins/commit/a0cfd0b5185c86f34226e67ad33509a86f686bba) Thanks [@h93xV2](https://github.com/h93xV2)! - Upgraded the AWS SDK dependency in gatsby-source-s3 from v2 to v3.

  AWS SDK v2 is going into maintenance mode in 2023, and projects which use the old version have error messages logged in their consoles.

  The upgrade breaks backwards compatibility for existing plugin configurations, so a major version increment has been applied.

  For plugin configuration, the AWS property follows the [S3ClientConfig interface](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html), but adds the additional `Buckets` property unique to the plugin.

  The two main differences with the plugin configuration are:

  1. `region` is now required for custom endpoints.
  2. The `accessKeyId` and `secretAccessKey` properties have been moved into the `credentials` property.

### Patch Changes

- [#389](https://github.com/gatsby-uc/plugins/pull/389) [`a015186`](https://github.com/gatsby-uc/plugins/commit/a0151861197bef823f74bed00187ee80fa47d092) Thanks [@renovate](https://github.com/apps/renovate)! - chore(packages): update dependency start-server-and-test to v2

- [#361](https://github.com/gatsby-uc/plugins/pull/361) [`b37cbaf`](https://github.com/gatsby-uc/plugins/commit/b37cbaf4765363d33e024cd7e313074a23c6a13e) Thanks [@renovate](https://github.com/apps/renovate)! - chore(packages): update dependency cypress to v12

## 3.2.4

### Patch Changes

- [#382](https://github.com/gatsby-uc/plugins/pull/382) [`d578b78`](https://github.com/gatsby-uc/plugins/commit/d578b7896f804716a4c2222385c19be11c27bdf4) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#378](https://github.com/gatsby-uc/plugins/pull/378) [`07bbfa7`](https://github.com/gatsby-uc/plugins/commit/07bbfa7c434b8543a7d15c5f2e87ac48705aa593) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

## 3.2.3

### Patch Changes

- [#365](https://github.com/gatsby-uc/plugins/pull/365) [`369749a`](https://github.com/gatsby-uc/plugins/commit/369749a50931bc073ba25815dc6d1e6561de28de) Thanks [@moonmeister](https://github.com/moonmeister)! - chore(babel): update build tooling

- [#359](https://github.com/gatsby-uc/plugins/pull/359) [`b91e945`](https://github.com/gatsby-uc/plugins/commit/b91e945ebb0a25249f8432fa682bd771407c3b04) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 3.2.2

### Patch Changes

- [#351](https://github.com/gatsby-uc/plugins/pull/351) [`3029c4b`](https://github.com/gatsby-uc/plugins/commit/3029c4bd65bbc5bc5203c19bd93c392934518136) Thanks [@moonmeister](https://github.com/moonmeister)! - When plugins are nested inside a Gatsby Theme they are required to have an `index.js` file in the package root. We recently removed these not knowing this requirement. Files restored and tests added.

## 3.2.1

### Patch Changes

- [#310](https://github.com/gatsby-uc/plugins/pull/310) [`3c854d0`](https://github.com/gatsby-uc/plugins/commit/3c854d0fd7c4bb81c894a08d6dca0ca2c18f7025) Thanks [@renovate](https://github.com/apps/renovate)! - chore(babel): update build tooling

- [#313](https://github.com/gatsby-uc/plugins/pull/313) [`60fecbc`](https://github.com/gatsby-uc/plugins/commit/60fecbc600ce57bf82887a78f4e4d9a430b35f00) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 3.2.0

### Minor Changes

- [#303](https://github.com/gatsby-uc/plugins/pull/303) [`bae3266`](https://github.com/gatsby-uc/plugins/commit/bae326612720b00116aea0928fc84a01a328fbb7) Thanks [@renovate](https://github.com/apps/renovate)! - Bumping dependencies to match Gatsby v5 related changes. We will only be testing against Gatsby v5, so there's no promisses for Gatsby v4, though there's no known breaking changes.

### Patch Changes

- [#304](https://github.com/gatsby-uc/plugins/pull/304) [`7bfdd1c`](https://github.com/gatsby-uc/plugins/commit/7bfdd1c2ea6c4cff5c1b8ed82c4257c606a1ee77) Thanks [@renovate](https://github.com/apps/renovate)! - chore(packages): update dependency cypress to v11

- [#305](https://github.com/gatsby-uc/plugins/pull/305) [`97af0d6`](https://github.com/gatsby-uc/plugins/commit/97af0d667d8f6e5265773f9cdb8eb0a184b9a6fa) Thanks [@moonmeister](https://github.com/moonmeister)! - ADded ESLint configs and updated packages to lint rules. Don't expect any functional changes but code was changed. Please open an issue if you notice any change in behavior.

- [#288](https://github.com/gatsby-uc/plugins/pull/288) [`0a047a8`](https://github.com/gatsby-uc/plugins/commit/0a047a8a241c82205b7ac43abcb7f3b9ca5b97a0) Thanks [@moonmeister](https://github.com/moonmeister)! - chore(repo): node 18 version bumps and testing

## 3.1.6

### Patch Changes

- [#294](https://github.com/gatsby-uc/plugins/pull/294) [`f830e3a`](https://github.com/gatsby-uc/plugins/commit/f830e3ab2cf9dc4b6daf474ed717cd02179fd556) Thanks [@LekoArts](https://github.com/LekoArts)! - Change peerDependencies to allow Gatsby 5

## 3.1.5

### Patch Changes

- [#285](https://github.com/gatsby-uc/plugins/pull/285) [`feb27fc`](https://github.com/gatsby-uc/plugins/commit/feb27fc903253ad2d9815bc1f37b0132a7f3f89f) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 3.1.4

### Patch Changes

- [`d754500`](https://github.com/gatsby-uc/plugins/commit/d7545002adf961b1d398703cd2a9b2d45a7d2dbd) Thanks [@moonmeister](https://github.com/moonmeister)! - FIX: npm deploy wasn't shipping built code. Opps. Should be all good now.

## 3.1.3

### Patch Changes

- [#260](https://github.com/gatsby-uc/plugins/pull/260) [`7c07006`](https://github.com/gatsby-uc/plugins/commit/7c07006c0464a4219d89f0885d5811d01d8459ba) Thanks [@moonmeister](https://github.com/moonmeister)! - Adding Type checking for all TS files and fixing type issues.

- [#262](https://github.com/gatsby-uc/plugins/pull/262) [`4cec98e`](https://github.com/gatsby-uc/plugins/commit/4cec98e924efe03fc0c3cc890bcdd281c05c99b9) Thanks [@moonmeister](https://github.com/moonmeister)! - General cleanup of types. Implemented complete types for `createSchemaCustomization` to prevent errors related to querying bucket items even if none excist. Improved error handling, plugin will now break build if it cannot connect to specified buckets.

## 3.1.2

### Patch Changes

- [#231](https://github.com/gatsby-uc/plugins/pull/231) [`3b89aa7`](https://github.com/gatsby-uc/plugins/commit/3b89aa7dc075db200f5282bf03047d8e4258c2a7) Thanks [@moonmeister](https://github.com/moonmeister)! - Added verbose log for s3 connection config and updated typings

- [#243](https://github.com/gatsby-uc/plugins/pull/243) [`8116411`](https://github.com/gatsby-uc/plugins/commit/8116411db4130b8c33ad27da9994095f4323e2eb) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update non-major dependency versions

- [#233](https://github.com/gatsby-uc/plugins/pull/233) [`aee9120`](https://github.com/gatsby-uc/plugins/commit/aee91203964091e3466279948025fb3bc825bc42) Thanks [@moonmeister](https://github.com/moonmeister)! - chore: replace tsc based build pipline with babel and gatsby package config

- [#211](https://github.com/gatsby-uc/plugins/pull/211) [`f004e23`](https://github.com/gatsby-uc/plugins/commit/f004e23819e05b8b62ab57d8c59f743bddd47b8b) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-source-s3): update non-major dependency versions

## 3.1.1

### Patch Changes

- [#185](https://github.com/gatsby-uc/plugins/pull/185) [`156c352`](https://github.com/gatsby-uc/plugins/commit/156c3521f467331950296298954008dc5080be2a) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-source-s3): update non-major dependency versions

## 3.1.0

### Minor Changes

- [#154](https://github.com/gatsby-uc/plugins/pull/154) [`0da0fa1`](https://github.com/gatsby-uc/plugins/commit/0da0fa10c0bbf1020e3b11600715ee05cfa7d570) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-source-s3): update non-major dependency versions

### Patch Changes

- [#149](https://github.com/gatsby-uc/plugins/pull/149) [`8d6731b`](https://github.com/gatsby-uc/plugins/commit/8d6731b540e928dbc86ebc496a03b30f9bc2b983) Thanks [@moonmeister](https://github.com/moonmeister)! - test(gatsby-source-s3): setup e2e tests
