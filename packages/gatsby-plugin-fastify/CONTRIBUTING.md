## Intro

Thanks for your interest. There are two important things to know.

## Testing

Running `yarn test` will run tests. Make sure they pass when you start, and then keep them passing as you fix things and add features. If you're fixing a specific bug I'd recommend creating a test that fails before it is fixed so keep the bug from regressing. If you're adding a new feature, please write tests for the new feature.

## Benchmarks

When fixing bugs or adding features it'simportant to make sure our servers are fast. You can run benchmarks by building `integration-tests/plugin-fastify` via `yarn build` then run benchmarks with `yarn benchmark` from the `integration-tests/plugin-fastify` folder. To keep things consistent, shutdown as many other applications as possible.
