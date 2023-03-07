import { createRemoteFileNode } from "gatsby-source-filesystem";

import AWS_S3, {
  GetObjectCommand,
  ListObjectsCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type { CreateNodeArgs, GatsbyNode, PluginOptions } from "gatsby";

const isImage = (key: string): boolean => /\.(jpe?g|png|webp|tiff?)$/i.test(key);

interface PluginOptionsType extends PluginOptions {
  aws: S3ClientConfig;
  buckets: string[];
  expiration: number;
}

type ObjectType = AWS_S3._Object & { Bucket: string };

type NodeType = ObjectType & { url: string; [key: string]: string };

// source all objects from s3
export const sourceNodes: GatsbyNode["sourceNodes"] = async function (
  { actions: { createNode }, createNodeId, createContentDigest, reporter },
  pluginOptions: PluginOptionsType
) {
  const { aws: awsConfig, buckets, expiration = 900 } = pluginOptions;

  // configure aws
  const s3 = new S3Client(awsConfig);

  reporter.verbose(`AWS S3 Config: ${JSON.stringify(s3.config, undefined, 2)}`);

  // get objects
  const getS3ListObjects = async (parameters: { Bucket: string; Marker?: string }) => {
    const command = new ListObjectsCommand(parameters);
    return await s3.send(command);
  };

  const listAllS3Objects = async (bucket: string) => {
    const allS3Objects: ObjectType[] = [];

    try {
      const data = await getS3ListObjects({ Bucket: bucket });

      if (data && data.Contents) {
        for (const object of data.Contents) {
          allS3Objects.push({ ...object, Bucket: bucket });
        }
      } else {
        reporter.error(
          `Error processing objects from bucket "${bucket}". Is it empty?`,
          new Error("No object in Bucket"),
          "gatsby-source-s3"
        );
      }

      let nextToken = data && data.IsTruncated && data.NextMarker;

      while (nextToken) {
        const data = await getS3ListObjects({
          Bucket: bucket,
          Marker: nextToken,
        });

        if (data && data.Contents) {
          for (const object of data.Contents) {
            allS3Objects.push({ ...object, Bucket: bucket });
          }
        }
        nextToken = data && data.IsTruncated && data.NextMarker;
      }
    } catch (error: unknown) {
      reporter.panicOnBuild(`Error listing S3 objects on bucket "${bucket}"`, error as Error);
    }

    return allS3Objects;
  };

  try {
    const allBucketsObjects: ObjectType[][] = await Promise.all(
      buckets.map((bucket) => listAllS3Objects(bucket))
    );

    // flatten objects
    const objects = allBucketsObjects.flat();

    // create file nodes
    for (const object of objects) {
      const { Bucket, Key } = object;
      // get pre-signed URL
      const command = new GetObjectCommand({
        Bucket,
        Key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: expiration });
      createNode({
        ...object,
        url,
        // node meta
        id: createNodeId(`s3-object-${Key}`),
        parent: undefined,
        children: [],
        internal: {
          type: "S3Object",
          content: JSON.stringify(object),
          contentDigest: createContentDigest(object),
        },
      });
    }
  } catch (error) {
    reporter.error(`Error sourcing nodes: ${error}`);
  }
};

export const onCreateNode: GatsbyNode["onCreateNode"] = async function ({
  node,
  actions: { createNode, createNodeField },
  cache,
  reporter,
  createNodeId,
}: CreateNodeArgs<NodeType>) {
  if (node.internal.type === "S3Object" && node.Key && isImage(node.Key)) {
    try {
      // download image file and save as node
      const imageFile = await createRemoteFileNode({
        url: node.url,
        parentNodeId: node.id,
        cache,
        createNode,
        createNodeId,
      });

      if (imageFile) {
        // add local image file to s3 object node
        createNodeField({ node, name: "localFile", value: imageFile.id });
      }
    } catch (error) {
      reporter.error(`Error creating file node for S3 object key "${node.Key}": ${error}`);
    }
  }
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = async function ({
  actions,
}) {
  actions.createTypes(`
    type S3Object implements Node {
      Key: String!
      Bucket: String!
      LastModified: Date! @dateformat
      Size: Int!
      localFile: File @link(from: "fields.localFile")
    }
  `);
};
