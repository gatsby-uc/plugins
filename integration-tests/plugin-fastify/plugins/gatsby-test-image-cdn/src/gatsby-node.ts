import type { GatsbyNode } from "gatsby";
import { polyfillImageServiceDevRoutes } from "gatsby-plugin-utils/polyfill-remote-file";
import { addRemoteFilePolyfillInterface } from "gatsby-plugin-utils/polyfill-remote-file";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({
  actions,
  schema,
  reporter,
}) => {
  reporter.info("image-cdn-test plugin schemaCustomization");
  actions.createTypes(
    addRemoteFilePolyfillInterface(
      schema.buildObjectType({
        name: `TestImage`,
        fields: {
          title: "string",
        },
        interfaces: [`Node`, `RemoteFile`],
      }),
      {
        actions,
        schema,
      }
    )
  );
};

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({ actions, reporter }) => {
  reporter.info("image-cdn-test plugin sourceNodes");

  const testImage = {
    id: `test-image`,
    url: "https://images.unsplash.com/photo-1650247452475-b5866374545d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb",
    mimeType: "image/jpg",
    title: "test image",
    filename: "indonesia.jpg",
    width: 2666,
    height: 3996,
    internal: {
      type: `TestImage`,
      contentDigest: `test-image`,
      contentType: `image/jpg`,
    },
  };

  actions.createNode(testImage);
};

export const onCreateDevServer: GatsbyNode["onCreateDevServer"] = ({ app, reporter }) => {
  reporter.info("image-cdn-test plugin onCreateDevServer");

  polyfillImageServiceDevRoutes(app);
};
