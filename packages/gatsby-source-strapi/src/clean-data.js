import _ from "lodash";

import { getContentTypeSchema } from "./helpers";

const MEDIA_FIELDS = [
  "id",
  "name",
  "alternativeText",
  "caption",
  "width",
  "height",
  "formats",
  "hash",
  "ext",
  "mime",
  "size",
  "url",
  "previewUrl",
  "createdAt",
  "updatedAt",
  "documentId",
  "publishedAt",
];

const restrictedFields = new Set(["__component", `children`, `fields`, `internal`, `parent`]);

const getValue = (value, version) => {
  if (!value) {
    return;
  }
  if (version === 4) {
    return value?.data;
  }
  // assume v5
  return value;
};

const getAttributes = (data, version) => {
  if (!data) {
    return;
  }
  if (version === 4) {
    return {
      id: data.id,
      ...data.attributes,
    };
  }
  // assume v5
  return data;
};

// Recursively finds the latest updatedAt and publishedAt dates in the data object.
// This ensures that caching mechanisms that rely on these timestamps will work correctly
// when nested relations have more recent updates than their parent entities.
const findLatestDates = (data) => {
  let maxUpdatedAt;
  let maxPublishedAt;

  // helper function to check and update the max dates
  function checkDate(value, key) {
    if (typeof value === "string" && (key === "updatedAt" || key === "publishedAt")) {
      if (key === "updatedAt" && (!maxUpdatedAt || value > maxUpdatedAt)) {
        maxUpdatedAt = value;
      }
      if (key === "publishedAt" && (!maxPublishedAt || value > maxPublishedAt)) {
        maxPublishedAt = value;
      }
    }
  }

  // recursive function to traverse the entire data object
  function traverse(node) {
    if (Array.isArray(node)) {
      for (const value of node) {
        traverse(value);
      }
    } else if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        checkDate(value, key);
        traverse(value);
      }
    }
  }

  traverse(data);
  return { updatedAt: maxUpdatedAt, publishedAt: maxPublishedAt };
};

/**
 * Removes the attribute key in the entire data.
 * @param {Object} attributes response from the API
 * @param {Object} currentSchema
 * @param {*} schemas
 * @returns
 */
export const cleanAttributes = (attributes, currentSchema, schemas, version = 5) => {
  if (!attributes) {
    return;
  }

  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.entries(attributes).reduce((accumulator, [name, value]) => {
    const attribute = currentSchema.schema.attributes[name];

    const attributeName = restrictedFields.has(name) ? _.snakeCase(`strapi_${name}`) : name;

    if (!attribute?.type) {
      accumulator[attributeName] = value;

      return accumulator;
    }

    // Changing the format in order to extract images from the richtext field
    // NOTE: We could add an option to disable the extraction
    if (attribute.type === "richtext") {
      return {
        ...accumulator,
        [attributeName]: {
          data: value || "",
          medias: [],
        },
      };
    }

    if (!value) {
      accumulator[attributeName] = value;

      return accumulator;
    }

    if (attribute.type === "dynamiczone") {
      return {
        ...accumulator,
        [attributeName]: value.map((v) => {
          const compoSchema = getContentTypeSchema(schemas, v.__component);

          return cleanAttributes(v, compoSchema, schemas, version);
        }),
      };
    }

    if (attribute.type === "component") {
      const isRepeatable = attribute.repeatable;
      const compoSchema = getContentTypeSchema(schemas, attribute.component);

      if (isRepeatable) {
        return {
          ...accumulator,
          [attributeName]: value.map((v) => {
            return cleanAttributes(v, compoSchema, schemas, version);
          }),
        };
      }

      return {
        ...accumulator,
        [attributeName]: cleanAttributes(value, compoSchema, schemas, version),
      };
    }

    // make sure we can use both v4 and v5 outputs
    const valueData = getValue(value, version);

    if (attribute.type === "media") {
      if (Array.isArray(valueData)) {
        return {
          ...accumulator,
          [attributeName]: valueData
            ? valueData.map((data) => ({
                ..._.pick(getAttributes(data, version), MEDIA_FIELDS),
              }))
            : undefined,
        };
      }

      return {
        ...accumulator,
        [attributeName]: valueData
          ? {
              ..._.pick(getAttributes(valueData, version), MEDIA_FIELDS),
            }
          : undefined,
      };
    }

    if (attribute.type === "relation") {
      const relationSchema = getContentTypeSchema(schemas, attribute.target);
      if (Array.isArray(valueData)) {
        return {
          ...accumulator,
          [attributeName]: valueData.map((data) =>
            cleanAttributes(getAttributes(data, version), relationSchema, schemas, version),
          ),
        };
      }

      return {
        ...accumulator,
        [attributeName]: cleanAttributes(
          getAttributes(valueData, version) || undefined,
          relationSchema,
          schemas,
          version,
        ),
      };
    }

    accumulator[attributeName] = value;

    return accumulator;
  }, {});
};

/**
 * Transform v4 API response to the v3 format, remove data and attributes key
 * Transform richtext field to prepare media extraction
 * @param {Object} data
 * @param {Object} ctx
 * @returns {Object}
 */
export const cleanData = (data, context, version = 5) => {
  const { schemas, contentTypeUid } = context;
  const currentContentTypeSchema = getContentTypeSchema(schemas, contentTypeUid);
  const cleaned = cleanAttributes(
    getAttributes(data, version),
    currentContentTypeSchema,
    schemas,
    version,
  );
  const latest = findLatestDates(cleaned);
  return {
    ...cleaned,
    updatedAt: latest.updatedAt || cleaned.updatedAt || undefined,
    publishedAt: latest.publishedAt || cleaned.publishedAt || undefined,
  };
};
