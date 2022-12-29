# gatsby-source-supabase

## 2.1.1

### Patch Changes

- [#351](https://github.com/gatsby-uc/plugins/pull/351) [`3029c4b`](https://github.com/gatsby-uc/plugins/commit/3029c4bd65bbc5bc5203c19bd93c392934518136) Thanks [@moonmeister](https://github.com/moonmeister)! - When plugins are nested inside a Gatsby Theme they are required to have an `index.js` file in the package root. We recently removed these not knowing this requirement. Files restored and tests added.

## 2.1.0

### Minor Changes

- [#303](https://github.com/gatsby-uc/plugins/pull/303) [`bae3266`](https://github.com/gatsby-uc/plugins/commit/bae326612720b00116aea0928fc84a01a328fbb7) Thanks [@renovate](https://github.com/apps/renovate)! - Adding Gatsby v4 and v5 as peer dependencies. As these are they only supported versions of Gatsby.

### Patch Changes

- [#305](https://github.com/gatsby-uc/plugins/pull/305) [`97af0d6`](https://github.com/gatsby-uc/plugins/commit/97af0d667d8f6e5265773f9cdb8eb0a184b9a6fa) Thanks [@moonmeister](https://github.com/moonmeister)! - ADded ESLint configs and updated packages to lint rules. Don't expect any functional changes but code was changed. Please open an issue if you notice any change in behavior.

- [#288](https://github.com/gatsby-uc/plugins/pull/288) [`0a047a8`](https://github.com/gatsby-uc/plugins/commit/0a047a8a241c82205b7ac43abcb7f3b9ca5b97a0) Thanks [@moonmeister](https://github.com/moonmeister)! - chore(repo): node 18 version bumps and testing

## 2.0.0

### Major Changes

- [#182](https://github.com/gatsby-uc/plugins/pull/182) [`7d69632`](https://github.com/gatsby-uc/plugins/commit/7d69632231007ad5b66819a8db32aad608e78718) Thanks [@moonmeister](https://github.com/moonmeister)! - Move @supabase/supabase-js to be a peerDependancy. Use whatever version you like.

### Minor Changes

- [#182](https://github.com/gatsby-uc/plugins/pull/182) [`7d69632`](https://github.com/gatsby-uc/plugins/commit/7d69632231007ad5b66819a8db32aad608e78718) Thanks [@moonmeister](https://github.com/moonmeister)! - - Adding options validation for plugin config.
  - Refactored code to support async `query` Functions.
