const { createClient } = require("@supabase/supabase-js");

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    supabaseUrl: Joi.string()
      .uri({
        allowRelative: false,
      })
      .required(),
    supabaseKey: Joi.string().required(),
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
  { supabaseUrl, supabaseKey, types }
) => {
  const { createNode } = actions;

  const supabase = createClient(supabaseUrl, supabaseKey);

  for (const type of types) {
    const { type: typeName, query } = type;

    try {
      const { data, error } = await query(supabase);

      if (!Array.isArray(data) && !data?.length > 0) {
        reporter.panicOnBuild("No data found for type '" + typeName + "'", error);
        continue;
      }

      for (const item of data) {
        createNode({
          ...item,
          databaseId: item.id,
          id: createNodeId(`supabase-${typeName}-${item.id}`),
          parent: undefined,
          children: [],
          internal: {
            type: `Supabase${typeName}`,
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
