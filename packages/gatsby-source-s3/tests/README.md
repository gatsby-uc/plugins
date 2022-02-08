# Testing gatsby-source-s3

The plugin is tested end-to-end using [Cypress](https://www.cypress.io/).

The CI builds and serves the
[example Gatsby site](../integration-tests/source-s3) in this repo, and
runs the [Cypress tests](e2e/main.spec.js) against it.

The example site sources images from real S3 buckets, so the tests cover the
following cases:

- [x] processing images with `sharp` and rendering with `gatsby-image`
- [x] sourcing from multiple buckets (added in #14)
- [x] sourcing from private buckets (added in #20, using a pre-signed URL)
- [x] sourcing from a bucket with more than 1000 objects (added in #43, using a
      continuation token)

In total, the buckets hold 1502 objects, and the e2e tests assert that all are
correctly sourced and rendered.

Read more about the example site's AWS setup in the
[example site's README](../integration-tests/source-s3).
