import _ from "lodash";
import { getContentTypeSchema, makeParentNodeName } from "./helpers";

/**
 * Create a child node for json fields
 * @param {Object} json value
 * @param {Object} ctx
 * @returns {Object} gatsby node
 */
const prepareJSONNode = (json, context) => {
  const { createContentDigest, createNodeId, parentNode, attributeName } = context;

  const jsonNodeId = createNodeId(
    `${parentNode.strapi_id}-${parentNode.internal.type}-${attributeName}-JSONNode`
  );

  const JSONNode = {
    ...(_.isPlainObject(json) ? { ...json } : { strapi_json_value: json }),
    id: jsonNodeId,
    parent: parentNode.id,
    children: [],
    internal: {
      type: _.toUpper(`${parentNode.internal.type}_${attributeName}_JSONNode`),
      mediaType: `application/json`,
      content: JSON.stringify(json),
      contentDigest: createContentDigest(json),
    },
  };

  return JSONNode;
};

/**
 * Create a child node for relation and link the parent node to it
 * @param {Object} relation
 * @param {Object} ctx
 * @returns {Object} gatsby node
 */
const prepareRelationNode = (relation, context) => {
  const { schemas, createNodeId, createContentDigest, parentNode, targetSchemaUid } = context;

  // const targetSchema = getContentTypeSchema(schemas, targetSchemaUid);
  // const {
  //   schema: { singularName },
  // } = targetSchema;

  const nodeType = makeParentNodeName(schemas, targetSchemaUid);
  const relationNodeId = createNodeId(`${nodeType}-${relation.id}`);

  const node = {
    ...relation,
    id: relationNodeId,
    strapi_id: relation.id,
    parent: parentNode.id,
    children: [],
    internal: {
      type: nodeType,
      content: JSON.stringify(relation),
      contentDigest: createContentDigest(relation),
    },
  };

  return node;
};

/**
 * Create a child node for markdown fields
 * @param {String} text value
 * @param {Object} ctx
 * @returns {Object} gatsby node
 */
const prepareTextNode = (text, context) => {
  const { createContentDigest, createNodeId, parentNode, attributeName } = context;
  const textNodeId = createNodeId(
    `${parentNode.strapi_id}-${parentNode.internal.type}-${attributeName}-TextNode`
  );

  const textNode = {
    id: textNodeId,
    parent: parentNode.id,
    children: [],
    [attributeName]: text,
    internal: {
      type: _.toUpper(`${parentNode.internal.type}_${attributeName}_TextNode`),
      mediaType: `text/markdown`,
      content: text,
      contentDigest: createContentDigest(text),
    },
  };

  return textNode;
};

/**
 * Create a child node for media and link the parent node to it
 * @param {Object} media
 * @param {Object} ctx
 * @returns {Object} gatsby node
 */
const prepareMediaNode = (media, context) => {
  const { createNodeId, createContentDigest, parentNode } = context;

  const nodeType = "STRAPI__MEDIA";
  const relationNodeId = createNodeId(`${nodeType}-${media.id}`);

  const node = {
    ...media,
    id: relationNodeId,
    strapi_id: media.id,
    parent: parentNode.id,
    children: [],
    internal: {
      type: nodeType,
      content: JSON.stringify(media),
      contentDigest: createContentDigest(media),
    },
  };

  return node;
};

/**
 * Returns an array of the main node and children nodes to create
 * @param {Object} entity the main entry
 * @param {String} nodeType the name of the main node
 * @param {Object} ctx object of gatsby functions
 * @param {String} uid the main schema uid
 * @returns {Object[]} array of nodes to create
 */
export const createNodes = (entity, context, uid) => {
  const nodes = [];

  const { schemas, createNodeId, createContentDigest, getNode } = context;
  const nodeType = makeParentNodeName(schemas, uid);

  let entryNode = {
    id: createNodeId(`${nodeType}-${entity.id}`),
    strapi_id: entity.id,
    parent: undefined,
    children: [],
    internal: {
      type: nodeType,
      content: JSON.stringify(entity),
      contentDigest: createContentDigest(entity),
    },
  };

  const schema = getContentTypeSchema(schemas, uid);

  for (const attributeName of Object.keys(entity)) {
    const value = entity[attributeName];

    const attribute = schema.schema.attributes[attributeName];
    const type = _.get(attribute, "type");

    if (value) {
      // Add support for dynamic zones
      if (type === "dynamiczone") {
        for (const v of value) {
          const componentNodeName = makeParentNodeName(schemas, v.strapi_component);

          const valueNodes = createNodes(v, context, v.strapi_component).flat();
          const compoNodeIds = valueNodes
            .filter(({ internal }) => internal.type === componentNodeName)
            .map(({ id }) => id);

          entity[`${attributeName}___NODE`] = [
            ...(entity[`${attributeName}___NODE`] || []),
            ...compoNodeIds,
          ];

          for (const n of valueNodes) {
            nodes.push(n);
          }
        }

        delete entity[attributeName];
      }

      if (type === "relation") {
        // Create type for the first level of relations, otherwise the user should fetch the other content type
        // to link them
        const config = {
          schemas,
          createContentDigest,
          createNodeId,
          parentNode: entryNode,
          attributeName,
          targetSchemaUid: attribute.target,
        };

        if (Array.isArray(value)) {
          const relationNodes = value.map((relation) => prepareRelationNode(relation, config));
          entity[`${attributeName}___NODE`] = relationNodes.map(({ id }) => id);

          for (const node of relationNodes) {
            if (!getNode(node.id)) {
              nodes.push(node);
            }
          }
        } else {
          const relationNode = prepareRelationNode(value, config);

          entity[`${attributeName}___NODE`] = relationNode.id;

          const relationNodeToCreate = getNode(relationNode.id);

          if (!relationNodeToCreate) {
            nodes.push(relationNode);
          }
        }
        delete entity[attributeName];
      }

      // Apply transformations to components: markdown, json...
      if (type === "component") {
        const componentSchema = getContentTypeSchema(schemas, attribute.component);
        const componentNodeName = makeParentNodeName(schemas, componentSchema.uid);

        if (attribute.repeatable) {
          const compoNodes = value.flatMap((v) => createNodes(v, context, attribute.component));

          // Just link the component nodes and not the components' children one
          entity[`${attributeName}___NODE`] = compoNodes
            .filter(({ internal }) => internal.type === componentNodeName)
            .map(({ id }) => id);

          for (const node of compoNodes) {
            nodes.push(node);
          }
        } else {
          const compoNodes = createNodes(value, context, attribute.component).flat();
          // Just link the component node and not the component's children one
          entity[`${attributeName}___NODE`] = compoNodes.find(
            ({ internal }) => internal.type === componentNodeName
          ).id;

          for (const node of compoNodes) {
            nodes.push(node);
          }
        }

        delete entity[attributeName];
      }

      // Create nodes for richtext in order to make the markdown-remark plugin works
      if (type === "richtext") {
        const textNode = prepareTextNode(value.data, {
          createContentDigest,
          createNodeId,
          parentNode: entryNode,
          attributeName,
        });

        entity[attributeName][`data___NODE`] = textNode.id;

        delete entity[attributeName].data;

        nodes.push(textNode);
      }

      // Create nodes for JSON fields in order to be able to query each field in GraphiQL
      // We can remove this if not pertinent
      if (type === "json") {
        const JSONNode = prepareJSONNode(value, {
          createContentDigest,
          createNodeId,
          parentNode: entryNode,
          attributeName,
        });

        entryNode.children = [...entryNode.children, JSONNode.id];

        entity[`${attributeName}___NODE`] = JSONNode.id;
        // Resolve only the attributeName___NODE and not to both ones
        delete entity[attributeName];

        nodes.push(JSONNode);
      }

      if (type == "media") {
        const config = {
          createContentDigest,
          createNodeId,
          parentNode: entryNode,
        };

        if (Array.isArray(value)) {
          const mediaNodes = value.map((relation) => prepareMediaNode(relation, config));
          entity[`${attributeName}___NODE`] = mediaNodes.map(({ id }) => id);

          for (const node of mediaNodes) {
            if (!getNode(node.id)) {
              nodes.push(node);
            }
          }
        } else {
          const mediaNode = prepareMediaNode(value, config);

          entity[`${attributeName}___NODE`] = mediaNode.id;

          const relationNodeToCreate = getNode(mediaNode.id);

          if (!relationNodeToCreate) {
            nodes.push(mediaNode);
          }
        }
        // Resolve only the attributeName___NODE and not to both ones
        delete entity[attributeName];
      }
    }
  }

  entryNode = {
    ...entity,
    ...entryNode,
  };

  nodes.push(entryNode);

  return nodes;
};
