import path from "path";
import fs from "fs-extra";
import mime from "mime";
import { fetchRemoteFile } from "gatsby-core-utils/fetch-remote-file";
import { transformImage } from "gatsby-plugin-utils/polyfill-remote-file/transform-images";

import type { FastifyPluginAsync } from "fastify";
import { PATH_TO_PUBLIC } from "../utils/constants";

export const handleImageTransforms: FastifyPluginAsync = async (fastify) => {
  fastify.log.debug(`📷  Handling file transforms`);
  fastify.get<{
    Params: {
      url: string;
      filename: string;
    };
  }>(`/_gatsby/file/:url/:filename`, async (req, reply) => {
    // remove the file extension
    const { url, filename } = req.params;
    const outputDir = path.join(process.cwd(), `public`, `_gatsby`, `file`);

    const filePath = await fetchRemoteFile({
      directory: outputDir,
      url: url,
      name: filename,
    });
    reply.appendModuleHeader(`Image Transforms`);

    reply.send(fs.createReadStream(filePath));
  });

  fastify.log.debug(`📷  Handling image transforms`);
  fastify.get<{
    Params: {
      url: string;
      params: string;
      filename: string;
    };
  }>(`/_gatsby/image/:url/:params/:filename`, async (req, reply) => {
    const { params, url, filename } = req.params;

    const searchParams = new URLSearchParams(Buffer.from(params, `base64`).toString());

    const resizeParams: {
      width: number;
      height: number;
      quality: number;
      format: string;
    } = {
      width: 0,
      height: 0,
      quality: 75,
      format: ``,
    };

    for (const [key, value] of searchParams) {
      switch (key) {
        case `w`: {
          resizeParams.width = Number(value);
          break;
        }
        case `h`: {
          resizeParams.height = Number(value);
          break;
        }
        case `fm`: {
          resizeParams.format = value;
          break;
        }
        case `q`: {
          resizeParams.quality = Number(value);
          break;
        }
      }
    }

    const remoteUrl = Buffer.from(url, `base64`).toString();
    const outputDir = path.join(PATH_TO_PUBLIC, `_gatsby`, `_image`, url);

    const filePath = await transformImage({
      outputDir,
      args: {
        url: remoteUrl,
        filename,
        ...resizeParams,
      },
    });

    reply.header(`content-type`, mime.getType(path.extname(filename)));
    reply.appendModuleHeader(`Image Transforms`);

    reply.send(fs.createReadStream(filePath));
  });
};
