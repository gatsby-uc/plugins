import { addImageRoutes } from "gatsby-plugin-utils/polyfill-remote-file";

import type { FastifyPluginAsync } from "fastify";

export const handleImageTransforms: FastifyPluginAsync = async (fastify) => {
  fastify.log.debug(`📷  Handling file/image transforms aka "Gatsby Image CDN"`);
  addImageRoutes(fastify);
};
