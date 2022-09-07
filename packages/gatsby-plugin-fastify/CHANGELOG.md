# gatsby-plugin-fastify

## 0.9.0

### Minor Changes

- [#245](https://github.com/gatsby-uc/plugins/pull/245) [`5f4decc`](https://github.com/gatsby-uc/plugins/commit/5f4decc6554ad6755e51daf01a4192307158956d) Thanks [@moonmeister](https://github.com/moonmeister)! - Upgraded fastify to v4 and bumped majors on related and unrelated packages.

  ## Breaking Changes

  - Logging no longer defaults to "pretty print" unless the environment variable`NODE_ENV` equals `development`.

  - Changes were made to the static file servers config. This fixed issues introduced by fastify updates. While this didn't break tests or knowingly intoduce bugs please let us know if you see any behavior changes.

### Patch Changes

- [#243](https://github.com/gatsby-uc/plugins/pull/243) [`8116411`](https://github.com/gatsby-uc/plugins/commit/8116411db4130b8c33ad27da9994095f4323e2eb) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update non-major dependency versions

- [#241](https://github.com/gatsby-uc/plugins/pull/241) [`35ba22d`](https://github.com/gatsby-uc/plugins/commit/35ba22de4d10f1402b113880567f561aff4056ab) Thanks [@renovate](https://github.com/apps/renovate)! - chore(all-build-deps): update build tooling

- [#227](https://github.com/gatsby-uc/plugins/pull/227) [`a08f176`](https://github.com/gatsby-uc/plugins/commit/a08f176070950d0bc63b00ec74c173f14c50b4bf) Thanks [@tsdexter](https://github.com/tsdexter)! - chore(gatsby-plugin-fastify): Update README.md

## 0.8.1

### Patch Changes

- [#202](https://github.com/gatsby-uc/plugins/pull/202) [`9ced9cb`](https://github.com/gatsby-uc/plugins/commit/9ced9cbc77b2eac88790ced90d8dcf401e258a55) Thanks [@moonmeister](https://github.com/moonmeister)! - Implemented the new "Gatsby Image CDN" from Gatsby Cloud. See the docs for getting started.

## 0.8.0

### Minor Changes

- [#176](https://github.com/gatsby-uc/plugins/pull/176) [`f556171`](https://github.com/gatsby-uc/plugins/commit/f556171cfbd44a379960a9bceb9f52b081f9ef8c) Thanks [@moonmeister](https://github.com/moonmeister)! - This plugin's focus is on serving the web app. Compression should be handled by an edge server (e.g. Nginx). Therefore we are removing this feature, this should not break an existing config, though you may see a warning during build if you explicitly set the compression setting in your `gatsby-config.js`.

* [#200](https://github.com/gatsby-uc/plugins/pull/200) [`4a291b1`](https://github.com/gatsby-uc/plugins/commit/4a291b16d9fab8989ae045845a6ac95b11d1a7d3) Thanks [@moonmeister](https://github.com/moonmeister)! - We're nolonger treating the fastify plugins as public API. They've been removed from docs. If you're using them you may continue to do so at your own risk. If you'd like to contribute to help make these publically maintainable please open an issue.

### Patch Changes

- [#199](https://github.com/gatsby-uc/plugins/pull/199) [`eec780b`](https://github.com/gatsby-uc/plugins/commit/eec780bc8643bc5b2b5da9b85fc221c14cec743b) Thanks [@moonmeister](https://github.com/moonmeister)! - Did some reworking of redirects and added support for Gatsby's new Reverse Proxy functionality.

## 0.7.5

### Patch Changes

- [#187](https://github.com/gatsby-uc/plugins/pull/187) [`48c3369`](https://github.com/gatsby-uc/plugins/commit/48c336942ad638f1fb7483460ceb8fc4607ef3cc) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update non-major dependency versions

## 0.7.4

### Patch Changes

- [#177](https://github.com/gatsby-uc/plugins/pull/177) [`4c1365d`](https://github.com/gatsby-uc/plugins/commit/4c1365d639ecb1f0409d72db4e15593706d82639) Thanks [@jrotering](https://github.com/jrotering)! - Updated broken fastify documentation links & fixed typo

## 0.7.3

### Patch Changes

- [#163](https://github.com/gatsby-uc/plugins/pull/163) [`a3c5e55`](https://github.com/gatsby-uc/plugins/commit/a3c5e55542ad0b3dd97afcc04d686a00d44bdbe3) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update gatsby monorepo (major)

* [#150](https://github.com/gatsby-uc/plugins/pull/150) [`1d9f473`](https://github.com/gatsby-uc/plugins/commit/1d9f4732872028be5cd8e77e7af15c478d392311) Thanks [@renovate](https://github.com/apps/renovate)! - chore(gatsby-plugin-fastify): update non-major dependency versions

## 0.7.2

### Patch Changes

- [`5d1f1bf`](https://github.com/gatsby-uc/plugins/commit/5d1f1bf7989c119540760dc40ae7bc4dcf822836) Thanks [@moonmeister](https://github.com/moonmeister)! - Update package dependencies

## 0.7.1

### Patch Changes

- [#128](https://github.com/gatsby-uc/plugins/pull/128) [`331bf7d`](https://github.com/gatsby-uc/plugins/commit/331bf7d2464701f8dab39c8e680efa3c996f056b) Thanks [@renovate](https://github.com/apps/renovate)! - fix(gatsby-plugin-fastify): update non-major dependency versions

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
