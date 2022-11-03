const { setupFastify, shutdownFastify } = require("./server");

beforeAll(async () => {
  globalThis.fastify = await setupFastify();
});

afterAll(async () => {
  await shutdownFastify(globalThis.fastify);
});
