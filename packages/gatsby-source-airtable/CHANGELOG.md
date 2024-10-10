# Changelog

## 2.4.3

### Patch Changes

- [#469](https://github.com/gatsby-uc/plugins/pull/469) [`4759545`](https://github.com/gatsby-uc/plugins/commit/475954526a982c149696255f7ddfb3dba60e17b5) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 2.4.2

### Patch Changes

- [#461](https://github.com/gatsby-uc/plugins/pull/461) [`caf7d4f`](https://github.com/gatsby-uc/plugins/commit/caf7d4feb52b9ca062b0d78883659d62e86243f4) Thanks [@moonmeister](https://github.com/moonmeister)! - Updated can-i-use database

- [#461](https://github.com/gatsby-uc/plugins/pull/461) [`caf7d4f`](https://github.com/gatsby-uc/plugins/commit/caf7d4feb52b9ca062b0d78883659d62e86243f4) Thanks [@moonmeister](https://github.com/moonmeister)! - - Updated testing and runners to latest Node 20 LTS.

  - Updated to latests Yarn v4 and corepack for management of packageManager. Please run `corepack enable` to use the correct version of `yarn`.
  - Updated dependencies.
  - Updated prettier and associated formatting.
  - Update TypeScript versions used to latest.

- [#444](https://github.com/gatsby-uc/plugins/pull/444) [`b7b48b7`](https://github.com/gatsby-uc/plugins/commit/b7b48b781885a7b0378bb44f18ee18b0733a3981) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

- [#453](https://github.com/gatsby-uc/plugins/pull/453) [`6a313dc`](https://github.com/gatsby-uc/plugins/commit/6a313dca5b1f7f71a2a7ef8c19aef7e72e5f7445) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 2.4.1

### Patch Changes

- [#445](https://github.com/gatsby-uc/plugins/pull/445) [`f786b3f`](https://github.com/gatsby-uc/plugins/commit/f786b3fcf4b731e04ecb6ac4f07e956a7e01a6d9) Thanks [@jonesbp](https://github.com/jonesbp)! - Update documentation on API key creation

## 2.4.0

### Minor Changes

- [#430](https://github.com/gatsby-uc/plugins/pull/430) [`23f9fba`](https://github.com/gatsby-uc/plugins/commit/23f9fba42e854a86874545c4fce2be2858133c5f) Thanks [@tboutron](https://github.com/tboutron)! - Fix homepage link for plugins

### Patch Changes

- [#418](https://github.com/gatsby-uc/plugins/pull/418) [`c6b3c08`](https://github.com/gatsby-uc/plugins/commit/c6b3c084c542b24ed0e953005f394fdb62396465) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 2.3.2

### Patch Changes

- [#382](https://github.com/gatsby-uc/plugins/pull/382) [`d578b78`](https://github.com/gatsby-uc/plugins/commit/d578b7896f804716a4c2222385c19be11c27bdf4) Thanks [@renovate](https://github.com/apps/renovate)! - fix(packages): update non-major dependency versions

## 2.3.1

### Patch Changes

- [#369](https://github.com/gatsby-uc/plugins/pull/369) [`1acb646`](https://github.com/gatsby-uc/plugins/commit/1acb6466e2a3423acc6323126243964a9162e64d) Thanks [@jbolda](https://github.com/jbolda)! - Moved this source plugin into gatsby-uc/plugins repo for improved ongoing maintenance.

## \[2.3.0]

- This makes the fileNode pull `name` from the airtable metadata instead of the
  remote file, because when an airtable user changes the file name, airtable does
  not rename the original url. This change makes file name changes in airtable
  usable in the fileNode instead of needing to download, rename, and re-upload the
  file.
  - [4c107f6](https://github.com/jbolda/gatsby-source-airtable/commit/4c107f63af56b7e1a3f6d54d22b840c98a638c3d) Adding change file on 2021-12-13
  - [0d8c3f2](https://github.com/jbolda/gatsby-source-airtable/commit/0d8c3f2c52cb98064ccfc2852afb5d9135160c3a) Copy/pasted from the example without changing the type, oops! on 2021-12-13
  - [d7200c0](https://github.com/jbolda/gatsby-source-airtable/commit/d7200c0be3c5b5896fa9d479836b8d5d33ee6b03) apply suggestions from code review on 2022-05-21

## \[2.2.1]

- Add logging statement
  - [3c53464](https://github.com/jbolda/gatsby-source-airtable/commit/3c53464f075d8931da91d6762d0b6949d703f897) Add logging message in catch on 2021-07-11

## \[2.2.0]

- Initialize covector to perform versioning and publishing of `gatsby-source-airtable`.
  - [3e65bed](https://github.com/jbolda/gatsby-source-airtable/commit/3e65bed25d7226d69efd908de4f6f549e2ebb209) add covector on 2021-05-24
- Add custom node property with fetched records order
  - [0880d57](https://github.com/jbolda/gatsby-source-airtable/commit/0880d573a7280984abe276a0db8999391ddca6bb) Create change file & add usage example on 2021-05-26
- Upgrade `airtable.js` to `^0.11.1`. This will remove transitive dependencies on outdated libs.
  - [ef7a49f](https://github.com/jbolda/gatsby-source-airtable/commit/ef7a49f9a2b47b5968436aacca9bfdd3309ccf8e) fix(deps): update dependency airtable to ^0.11.0 on 2021-05-24
