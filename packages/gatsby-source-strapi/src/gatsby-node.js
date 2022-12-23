import { fetchStrapiContentTypes, fetchEntities, fetchEntity } from "./fetch";
import { downloadMediaFiles } from "./download-media-files";
import {
  buildMapFromNodes,
  buildNodesToRemoveMap,
  getEndpoints,
  makeParentNodeName,
} from "./helpers";
import { createNodes } from "./normalize";

const LAST_FETCHED_KEY = "timestamp";

export const onPreInit = () => console.log("Loaded gatsby-source-strapi-plugin");

export const sourceNodes = async (
  {
    actions,
    createContentDigest,
    createNodeId,
    reporter,
    getCache,
    store,
    cache,
    getNodes,
    getNode,
  },
  strapiConfig
) => {
  // Cast singleTypes and collectionTypes to empty arrays if they're not defined
  if (!Array.isArray(strapiConfig.singleTypes)) {
    strapiConfig.singleTypes = [];
  }
  if (!Array.isArray(strapiConfig.collectionTypes)) {
    strapiConfig.collectionTypes = [];
  }

  const { schemas } = await fetchStrapiContentTypes(strapiConfig);

  const { deleteNode, touchNode } = actions;

  const context = {
    strapiConfig,
    actions,
    schemas,
    createContentDigest,
    createNodeId,
    reporter,
    getCache,
    getNode,
    getNodes,
    store,
    cache,
  };

  const { unstable_createNodeManifest, createNode } = actions;

  const existingNodes = getNodes().filter(
    (n) => n.internal.owner === `gatsby-source-strapi` || n.internal.type === "File"
  );

  for (const n of existingNodes) {
    touchNode(n);
  }

  const endpoints = getEndpoints(strapiConfig, schemas);

  const lastFetched = await cache.get(LAST_FETCHED_KEY);

  const allResults = await Promise.all(
    endpoints.map(({ kind, ...config }) => {
      if (kind === "singleType") {
        return fetchEntity(config, context);
      }

      return fetchEntities(config, context);
    })
  );

  let newOrExistingEntries;

  // Fetch only the updated data between run
  if (lastFetched) {
    // Add the updatedAt filter
    const deltaEndpoints = endpoints.map((endpoint) => {
      return {
        ...endpoint,
        queryParams: {
          ...endpoint.queryParams,
          filters: {
            ...endpoint.queryParams.filters,
            updatedAt: { $gt: lastFetched },
          },
        },
      };
    });

    newOrExistingEntries = await Promise.all(
      deltaEndpoints.map(({ kind, ...config }) => {
        if (kind === "singleType") {
          return fetchEntity(config, context);
        }

        return fetchEntities(config, context);
      })
    );
  }

  const data = newOrExistingEntries || allResults;

  // Build a map of all nodes with the gatsby id and the strapi_id
  const existingNodesMap = buildMapFromNodes(existingNodes);

  // Build a map of all the parent nodes that should be removed
  // This should also delete all the created nodes for markdown, relations, dz...
  // When fetching only one content type and populating its relations it might cause some issues
  // as the relation nodes will never be deleted
  // it's best to fetch the content type and its relations separately and to populate
  // only one level of relation
  const nodesToRemoveMap = buildNodesToRemoveMap(existingNodesMap, endpoints, allResults);

  // Delete all nodes that should be deleted
  for (const [nodeName, nodesToDelete] of Object.entries(nodesToRemoveMap)) {
    if (nodesToDelete.length > 0) {
      reporter.info(`Strapi: ${nodeName} deleting ${nodesToDelete.length}`);

      for (const { id } of nodesToDelete) {
        const node = getNode(id);

        touchNode(node);
        deleteNode(node);
      }
    }
  }

  let warnOnceForNoSupport = false;

  await cache.set(LAST_FETCHED_KEY, Date.now());

  for (const [index, { uid }] of endpoints.entries()) {
    if (!strapiConfig.skipFileDownloads) {
      await downloadMediaFiles(data[index], context, uid);
    }

    for (let entity of data[index]) {
      const nodes = createNodes(entity, context, uid);

      await Promise.all(nodes.map((n) => createNode(n)));

      const nodeType = makeParentNodeName(context.schemas, uid);

      const mainEntryNode = nodes.find((n) => {
        return n && n.strapi_id === entity.id && n.internal.type === nodeType;
      });

      const isPreview = process.env.GATSBY_IS_PREVIEW === `true`;
      const createNodeManifestIsSupported = typeof unstable_createNodeManifest === `function`;
      const shouldCreateNodeManifest = isPreview && createNodeManifestIsSupported && mainEntryNode;

      if (shouldCreateNodeManifest) {
        const updatedAt = entity.updatedAt;
        const manifestId = `${uid}-${entity.id}-${updatedAt}`;

        unstable_createNodeManifest({
          manifestId,
          node: mainEntryNode,
          updatedAtUTC: updatedAt,
        });
      } else if (isPreview && !createNodeManifestIsSupported && !warnOnceForNoSupport) {
        console.warn(
          `gatsby-source-strapi: Your version of Gatsby core doesn't support Content Sync (via the unstable_createNodeManifest action). Please upgrade to the latest version to use Content Sync in your site.`
        );
        warnOnceForNoSupport = true;
      }
    }
  }

  return;
};
