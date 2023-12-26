import { setupFastify, shutdownFastify } from "./server";

beforeAll(async () => {
  return (globalThis.fastify = await setupFastify());
}, 10_000);

afterAll(async () => {
  return shutdownFastify(globalThis.fastify);
});
