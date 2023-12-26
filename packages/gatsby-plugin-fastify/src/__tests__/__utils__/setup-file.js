import { setupFastify, shutdownFastify } from "./server";

beforeAll(async () => {
  globalThis.fastify = await setupFastify();
}, 100_000);

afterAll(async () => {
  await shutdownFastify(globalThis.fastify);
});
