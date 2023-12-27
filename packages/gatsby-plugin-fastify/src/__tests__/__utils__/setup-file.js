import { setupFastify, shutdownFastify } from "./server";

beforeAll(async () => {
  jest.setTimeout(30_000);
  return (globalThis.fastify = await setupFastify());
});

afterAll(async () => {
  return shutdownFastify(globalThis.fastify);
});
