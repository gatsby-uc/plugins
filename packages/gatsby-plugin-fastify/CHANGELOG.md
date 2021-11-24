# gatsby-plugin-fastify

## 0.7.0

### Minor Changes

- [#124](https://github.com/gatsby-uc/plugins/pull/124) [`e93dc62`](https://github.com/gatsby-uc/plugins/commit/e93dc62044ce2ac2069d80c339247901b4416ece) Thanks [@moonmeister](https://github.com/moonmeister)! - Updated "client path" name to "client routes" for consistency. Imports changed to `import { handleClientOnlyRoutes } from "./clientRoutes";`

* [#124](https://github.com/gatsby-uc/plugins/pull/124) [`e93dc62`](https://github.com/gatsby-uc/plugins/commit/e93dc62044ce2ac2069d80c339247901b4416ece) Thanks [@moonmeister](https://github.com/moonmeister)! - Remove fastify plugins from peer deps to normal dependencies. Only Gatsby and fastify are peer deps now.

- [#123](https://github.com/gatsby-uc/plugins/pull/123) [`acbf356`](https://github.com/gatsby-uc/plugins/commit/acbf356b305eff55f4ef96c77fbb47b2360319da) Thanks [@moonmeister](https://github.com/moonmeister)! - Set the HTTP response code when `status` is returned from `getServerData`. https://www.gatsbyjs.com/docs/reference/release-notes/v4.2/#getserverdata-improvements

## 0.6.1

### Patch Changes

- [#112](https://github.com/gatsby-uc/plugins/pull/112) [`529590e`](https://github.com/gatsby-uc/plugins/commit/529590eb9e83ec4188ad9ef23eca9c9d14fb8729) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update non-major dependency versions

## 0.6.0

### Minor Changes

- [#68](https://github.com/gatsby-uc/plugins/pull/68) [`e736248`](https://github.com/gatsby-uc/plugins/commit/e736248513e6bdbeb29cbedd06b79ed40ac0294f) Thanks [@moonmeister](https://github.com/moonmeister)! - feat: much improved logging

* [#68](https://github.com/gatsby-uc/plugins/pull/68) [`e736248`](https://github.com/gatsby-uc/plugins/commit/e736248513e6bdbeb29cbedd06b79ed40ac0294f) Thanks [@moonmeister](https://github.com/moonmeister)! - feat: add support for Gatsby 500 error if SSR/DSG throws an error.

- [#68](https://github.com/gatsby-uc/plugins/pull/68) [`e736248`](https://github.com/gatsby-uc/plugins/commit/e736248513e6bdbeb29cbedd06b79ed40ac0294f) Thanks [@moonmeister](https://github.com/moonmeister)! - Support for Gatsby v4's DSG and SSR routes.

### Patch Changes

- [#68](https://github.com/gatsby-uc/plugins/pull/68) [`e736248`](https://github.com/gatsby-uc/plugins/commit/e736248513e6bdbeb29cbedd06b79ed40ac0294f) Thanks [@moonmeister](https://github.com/moonmeister)! - Fix: SSR/DSG routes throwing non-fatal error when returning file.

* [#68](https://github.com/gatsby-uc/plugins/pull/68) [`e736248`](https://github.com/gatsby-uc/plugins/commit/e736248513e6bdbeb29cbedd06b79ed40ac0294f) Thanks [@moonmeister](https://github.com/moonmeister)! - fix: handle situations where dev doesn't provide 404 page by falling back to generic 404.

## 0.5.0

### Minor Changes

- [#100](https://github.com/gatsby-uc/plugins/pull/100) [`fec2c31`](https://github.com/gatsby-uc/plugins/commit/fec2c31d1d64a51d6b99297ff0c1345ec2f4bad3) Thanks [@moonmeister](https://github.com/moonmeister)! - Implemented better logging. This means we removed teh "verbose" flag from the CLI in favor of a "logLevel" flag. See docs for more info.

* [#97](https://github.com/gatsby-uc/plugins/pull/97) [`09bb2c2`](https://github.com/gatsby-uc/plugins/commit/09bb2c272f7127a732e1ad54d2b8fb38db054523) Thanks [@moonmeister](https://github.com/moonmeister)! - Implemented testing and that came with some minor changes and fixes.

## 0.4.5

### Patch Changes

- [#95](https://github.com/gatsby-uc/plugins/pull/95) [`7007934`](https://github.com/gatsby-uc/plugins/commit/700793427bf754a8449717179d51dabe76096d81) Thanks [@moonmeister](https://github.com/moonmeister)! - Add 404 handler for Gatsby functions to not use default Gatsby 404. thus any unknown route under "/api" now just returns a 404 and not found text.

## 0.4.4

### Patch Changes

- [#87](https://github.com/gatsby-uc/plugins/pull/87) [`5529aad`](https://github.com/gatsby-uc/plugins/commit/5529aadf0f65c4b0c193131d606c3ce7d8d06651) Thanks [@moonmeister](https://github.com/moonmeister)! - Update main server execution to use async/await from callbacks

## 0.4.3

### Patch Changes

- [#82](https://github.com/gatsby-uc/plugins/pull/82) [`eb12e74`](https://github.com/gatsby-uc/plugins/commit/eb12e74e05268ee7778f00711772749cd7d8ab6c) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update non-major dependency versions

* [#85](https://github.com/gatsby-uc/plugins/pull/85) [`80aa8f3`](https://github.com/gatsby-uc/plugins/commit/80aa8f39c79bed433b47dad39810767710d0bdd2) Thanks [@moonmeister](https://github.com/moonmeister)! - chore(gatsby-plugin-fastify): Misc cleanup and typing improvements

## 0.4.2

### Patch Changes

- [#77](https://github.com/gatsby-uc/plugins/pull/77) [`30f7ac4`](https://github.com/gatsby-uc/plugins/commit/30f7ac4bb5c39374b79ed900b3aab60f9c44774a) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): bump non-major package updates. This includes important security fixes for `fastify-static`.

## 0.4.1

### Patch Changes

- [#62](https://github.com/gatsby-uc/plugins/pull/62) [`79a49d6`](https://github.com/gatsby-uc/plugins/commit/79a49d63ef6fbb9ad997545e9e692f16b9e04ec3) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update non-major updates
  Updated patch/minor updates in dependencies
