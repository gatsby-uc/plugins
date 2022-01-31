import { createRemoteFileNode } from "gatsby-source-filesystem";
import type { CreateNodeArgs, SourceNodesArgs, CreateSchemaCustomizationArgs } from "gatsby";
import AWS = require("aws-sdk");

const isImage = (key: string): boolean => /\.(jpe?g|png|webp|tiff?)$/i.test(key);

type pluginOptionsType = {
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  buckets: string[];
  expiration: number;
};

type ObjectType = AWS.S3.Object & { Bucket: string };

type NodeType = ObjectType & { url: string; [key: string]: string };

// source all objects from s3
export async function sourceNodes(
  { actions: { createNode }, createNodeId, createContentDigest, reporter }: SourceNodesArgs,
  pluginOptions: pluginOptionsType
) {
  const { aws: awsConfig, buckets, expiration = 900 } = pluginOptions;

  // configure aws
  AWS.config.update(awsConfig);
  const s3 = new AWS.S3();

  // get objects
  const getS3ListObjects = async (params: { Bucket: string; ContinuationToken?: string }) => {
    return await s3
      .listObjectsV2(params)
      .promise()
      .catch((error) => {
        reporter.error(`Error listing S3 objects on bucket "${params.Bucket}": ${error}`);
      });
  };

  const listAllS3Objects = async (bucket: string) => {
    const allS3Objects: ObjectType[] = [];

    const data = await getS3ListObjects({ Bucket: bucket });

    if (data && data.Contents) {
      data.Contents.forEach((object) => {
        allS3Objects.push({ ...object, Bucket: bucket });
      });
    } else {
      reporter.error(`Error processing objects from bucket "${bucket}". Is it empty?`);
    }

    let nextToken = data && data.IsTruncated && data.NextContinuationToken;

    while (nextToken) {
      const data = await getS3ListObjects({
        Bucket: bucket,
        ContinuationToken: nextToken,
      });

      if (data && data.Contents) {
        data.Contents.forEach((object) => {
          allS3Objects.push({ ...object, Bucket: bucket });
        });
      }
      nextToken = data && data.IsTruncated && data.NextContinuationToken;
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
    objects?.forEach(async (object) => {
      const { Bucket, Key } = object;
      // get pre-signed URL
      const url = s3.getSignedUrl("getObject", {
        Bucket,
        Key,
        Expires: expiration,
      });

      createNode({
        ...object,
        url,
        // node meta
        id: createNodeId(`s3-object-${Key}`),
        parent: null,
        children: [],
        internal: {
          type: "S3Object",
          content: JSON.stringify(object),
          contentDigest: createContentDigest(object),
        },
      });
    });
  } catch (error) {
    reporter.error(`Error sourcing nodes: ${error}`);
  }
}

export async function onCreateNode({
  node,
  actions: { createNode, createNodeField },
  store,
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
        store,
        cache,
        reporter,
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
}

export async function createSchemaCustomization({ actions }: CreateSchemaCustomizationArgs) {
  actions.createTypes(`
    type S3Object implements Node {
      localFile: File @link(from: "fields.localFile")
    }
  `);
}
