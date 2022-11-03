// Gatsby values
export const BUILD_HTML_STAGE = `build-html`;
export const BUILD_CSS_STAGE = `build-css`;

export const COMMON_BUNDLES = [`commons`, `app`];

export const PAGE_DATA_DIR = `page-data/`;

export const PATH_TO_FUNCTIONS = ".cache/functions";
export const PATH_TO_PUBLIC = "public";
export const PATH_TO_CACHE = ".cache";

// Config Values

export const CONFIG_FILE_NAME = "gatsby-plugin-fastify.json";
export const CONFIG_FILE_PATH = PATH_TO_CACHE;

// implementation values

type Header = [string, string];
export const IMMUTABLE_CACHING_HEADER: Header = [
  `cache-control`,
  `public, max-age=31536000, immutable`,
];
export const NEVER_CACHE_HEADER: Header = [`cache-control`, `public, max-age=0, must-revalidate`];
