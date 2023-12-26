import { setupFastify, shutdownFastify } from "./server";

beforeAll(async () => {
  return (globalThis.fastify = await setupFastify());
}, 30_000);

afterAll(async () => {
  return shutdownFastify(globalThis.fastify);
});
