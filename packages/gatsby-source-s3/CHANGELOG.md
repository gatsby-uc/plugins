# gatsby-source-s3

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
