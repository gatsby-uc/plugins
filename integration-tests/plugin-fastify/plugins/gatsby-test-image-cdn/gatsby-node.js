"use strict";

exports.__esModule = true;
exports.sourceNodes = exports.onCreateDevServer = exports.createSchemaCustomization = void 0;

var _polyfillRemoteFile = require("gatsby-plugin-utils/polyfill-remote-file");

const createSchemaCustomization = ({ actions, schema, reporter }) => {
  reporter.info("image-cdn-test plugin schemaCustomization");
  actions.createTypes(
    schema.buildObjectType({
      name: `TestData`,
      fields: {
        title: `String`,
        content: `String`,
        image: `TestImage`,
      },
      interfaces: [`Node`],
    })
  );
  (0, _polyfillRemoteFile.addRemoteFilePolyfillInterface)(
    schema.buildObjectType({
      name: `TestImage`,
      fields: {},
      interfaces: [`Node`, `RemoteFile`],
    }),
    {
      actions,
      schema,
    }
  );
};

exports.createSchemaCustomization = createSchemaCustomization;

const sourceNodes = async ({ actions }) => {
  console.log("image-cdn-test plugin sourceNodes");
  const testImage = {
    id: `test-image`,
    url: "https://images.unsplash.com/photo-1650247452475-b5866374545d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb",
    mimeType: "image/jpeg",
    filename: "indonesia.jpg",
    width: "2666",
    height: "3996",
    internal: {
      type: `TestImage`,
      contentDigest: `test-image`,
    },
  };
  actions.createNode(testImage);
  const testData = {
    id: `test-data`,
    title: "This is a test data",
    content: "This is a test data contet",
    image: "test-image",
    internal: {
      type: `TestData`,
      contentDigest: `test-data`,
    },
  };
  actions.createNode(testData);
};

exports.sourceNodes = sourceNodes;

const onCreateDevServer = ({ app }) => {
  console.log("image-cdn-test plugin onCreateDevServer");
  (0, _polyfillRemoteFile.polyfillImageServiceDevRoutes)(app);
};

exports.onCreateDevServer = onCreateDevServer;
