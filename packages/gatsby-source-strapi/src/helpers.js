import _ from "lodash";

const buildMapFromNodes = (nodes) => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return nodes.reduce((accumulator, current) => {
    const { internal, strapi_id, id } = current;
    const type = internal?.type;

    // We only delete the parent nodes
    if (type.includes("STRAPI__COMPONENT_")) {
      return accumulator;
    }

    if (type.includes("_JSONNODE")) {
      return accumulator;
    }

    if (type.includes("_TEXTNODE")) {
      return accumulator;
    }

    if (type && id && strapi_id) {
      accumulator[type] = accumulator[type]
        ? [
            ...accumulator[type],
            {
              strapi_id,
              id,
            },
          ]
        : [
            {
              strapi_id,
              id,
            },
          ];
    }

    return accumulator;
  }, {});
};

const buildMapFromData = (endpoints, data) => {
  const map = {};

  for (const [index, { singularName }] of endpoints.entries()) {
    const nodeType = _.toUpper(`Strapi_${_.snakeCase(singularName)}`);

    for (let entity of data[index]) {
      map[nodeType] = map[nodeType]
        ? [...map[nodeType], { strapi_id: entity.id }]
        : [{ strapi_id: entity.id }];
    }
  }

  return map;
};

const buildNodesToRemoveMap = (existingNodesMap, endpoints, data) => {
  const newNodes = buildMapFromData(endpoints, data);

  // eslint-disable-next-line unicorn/no-array-reduce
  const toRemoveMap = Object.entries(existingNodesMap).reduce((accumulator, [name, value]) => {
    const currentNodes = newNodes[name];

    // Since we create nodes for relations when fetching the api
    // We only to delete nodes that are actually being fetched
    if (!currentNodes) {
      return accumulator;
    }

    accumulator[name] = value.filter((index) => {
      return currentNodes.findIndex((k) => k.strapi_id === index.strapi_id) === -1;
    });

    return accumulator;
  }, {});

  return toRemoveMap;
};

const getContentTypeSchema = (schemas, ctUID) => {
  const currentContentTypeSchema = schemas.find(({ uid }) => uid === ctUID);

  return currentContentTypeSchema;
};

const getEndpoints = ({ collectionTypes, singleTypes }, schemas) => {
  const types = normalizeConfig({ collectionTypes, singleTypes });

  const endpoints = schemas
    .filter(
      ({ schema, uid }) =>
        !uid.startsWith("admin::") &&
        types.findIndex(({ singularName }) => singularName === schema.singularName) !== -1
    )
    .map(({ schema: { kind, singularName, pluralName }, uid, plugin }) => {
      const options = types.find((config) => config.singularName === singularName);
      const { queryParams, queryLimit, pluginOptions } = options;

      // Prepend plugin prefix except for users as their endpoint is /api/users
      const pluginPrefix = plugin && singularName !== "user" ? `${plugin}/` : "";

      if (kind === "singleType") {
        return {
          singularName,
          kind,
          uid,
          endpoint: `/api/${pluginPrefix}${singularName}`,
          queryParams: queryParams || {
            populate: "*",
          },
          pluginOptions,
        };
      }

      return {
        singularName,
        pluralName,
        kind,
        uid,
        endpoint: `/api/${pluginPrefix}${pluralName}`,
        queryParams: {
          ...queryParams,
          pagination: {
            pageSize: queryLimit || 250,
            page: 1,
          },
          populate: queryParams?.populate || "*",
        },
        pluginOptions,
      };
    });

  return endpoints;
};

const toSchemaDefinition = (types) =>
  types
    .map((config) => {
      if (_.isPlainObject(config)) {
        return config;
      }

      return { singularName: config };
    })
    .filter(Boolean);

const normalizeConfig = ({ collectionTypes, singleTypes }) => {
  const normalizedCollectionTypes = toSchemaDefinition(collectionTypes);
  const normalizedSingleTypes = toSchemaDefinition(singleTypes);

  return [...(normalizedCollectionTypes || []), ...(normalizedSingleTypes || [])];
};

const makeParentNodeName = (schemas, uid) => {
  const schema = getContentTypeSchema(schemas, uid);
  const {
    schema: { singularName, kind },
  } = schema;

  let nodeName = `Strapi_${_.snakeCase(singularName)}`;

  const isComponentType = !["collectionType", "singleType"].includes(kind);

  if (isComponentType) {
    nodeName = `Strapi__Component_${_.snakeCase(_.replace(uid, ".", "_"))}`;
  }

  return _.toUpper(nodeName);
};

export {
  buildMapFromNodes,
  buildMapFromData,
  buildNodesToRemoveMap,
  getContentTypeSchema,
  getEndpoints,
  makeParentNodeName,
};
