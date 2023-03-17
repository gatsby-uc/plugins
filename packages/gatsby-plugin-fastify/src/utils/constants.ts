// Gatsby values
export const PATH_TO_FUNCTIONS = ".cache/functions";
export const PATH_TO_PUBLIC = "public";
export const PATH_TO_CACHE = ".cache";

export const BUILD_HTML_STAGE = "build-html";
export const BUILD_CSS_STAGE = "build-css";

// Config Values

export const CONFIG_FILE_NAME = "gatsby-plugin-fastify.json";
export const CONFIG_FILE_PATH = PATH_TO_CACHE;

// implementation values
export const FUNCTIONS_PREFIX = "/api/";

export const IMMUTABLE_CACHING_HEADER = {
  "cache-control": `public, max-age=31536000, immutable`,
};
export const NEVER_CACHE_HEADER = { "cache-control": `public, max-age=0, must-revalidate` };

export const SECURITY_HEADERS = {
  "/**": {
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
  },
};

export const CACHING_HEADERS = {
  "/static/**": IMMUTABLE_CACHING_HEADER,
  "/_gatsby/image/**": {
    "cache-control": "undefined", // unset this since, else it will get 'Static' defaults
  },
  "/*.*": {
    "cache-control": "undefined", // unset this since fastify defaults to public, max-age=0 whereas gatsby hosting defaults unset
  },
  "/page-data/**": NEVER_CACHE_HEADER,
  "**/*.html": NEVER_CACHE_HEADER,
  "/*.js": {
    "cache-control": "undefined", // unset this since fastify defaults to public, max-age=0 whereas gatsby hosting defaults unset
  },
  "/sw.js": NEVER_CACHE_HEADER,
};
