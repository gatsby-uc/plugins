const sdk = require("node-appwrite");

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    appwriteEndpoint: Joi.string()
      .uri({
        allowRelative: false,
      })
      .required(),
    appwriteProject: Joi.string().required(),
    appwriteApiKey: Joi.string().required(),
    types: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().required(),
          query: Joi.function().arity(1).required(),
        })
      )
      .required()
      .min(1),
  });
};

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
  { appwriteEndpoint, appwriteProject, appwriteApiKey, types }
) => {
  const { createNode } = actions;

  const client = new sdk.Client();

  const databases = new sdk.Databases(client);

  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject).setKey(appwriteApiKey);

  for (const type of types) {
    const { type: typeName, query } = type;

    try {
      const { total, documents } = await query(databases);
      console.log("Appwrite Total:", total);

      if (!Array.isArray(documents) && !documents?.length > 0) {
        reporter.panicOnBuild("No data found for type '" + typeName + "'", error);
        continue;
      }

      for (const item of documents) {
        createNode({
          ...item,
          databaseId: item.$id,
          id: createNodeId(`appwrite-${typeName}-${item.$id}`),
          parent: undefined,
          children: [],
          internal: {
            type: `Appwrite${typeName}`,
            content: JSON.stringify(item),
            contentDigest: createContentDigest(item),
          },
        });
      }
    } catch (error) {
      reporter.panic("Error sourcing nodes data for type '" + typeName + "'", error);
    }
  }
};
