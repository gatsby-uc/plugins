// Gatsby values
export const PATH_TO_FUNCTIONS = ".cache/functions";
export const PATH_TO_PUBLIC = "public";
export const PATH_TO_CACHE = ".cache";

export const BUILD_HTML_STAGE = `build-html`;
export const BUILD_CSS_STAGE = `build-css`;

// Config Values

export const CONFIG_FILE_NAME = "gatsby-plugin-fastify.json";
export const CONFIG_FILE_PATH = PATH_TO_CACHE;

// implementation values
export const SECURITY_HEADERS = {
  "/*": [
    `X-Frame-Options: DENY`,
    `X-XSS-Protection: 1; mode=block`,
    `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: same-origin`,
  ],
};

export const IMMUTABLE_CACHING_HEADER = [`Cache-Control`, `public, max-age=31536000, immutable`];
export const NEVER_CACHE_HEADER = [`Cache-Control`, `public, max-age=0, must-revalidate`];

export const CACHING_HEADERS = {
  "/static/*": [IMMUTABLE_CACHING_HEADER],
  "/sw.js": [NEVER_CACHE_HEADER],
};
