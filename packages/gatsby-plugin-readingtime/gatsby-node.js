const readingTime = require("reading-time");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type ReadingTime @dontInfer {
      text: String,
      minutes: Float,
      time: Int,
      words: Int
    }
  `;

  createTypes(typeDefs);
};

exports.createResolvers = ({ createResolvers }, options) => {
  const resolvers = {};

  const { types, config } = options;

  Object.entries(types).forEach(([type, contentResolver]) => {
    resolvers[type] = {
      readingTime: {
        type: "ReadingTime",
        resolve: source => {
          const content = contentResolver(source);
          return readingTime(content, config);
        }
      }
    };
  });

  createResolvers(resolvers);
};
