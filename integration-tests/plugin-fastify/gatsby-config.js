module.exports = {
  pathPrefix: "stuff",
  siteMetadata: {
    title: "Test Gatsby",
    siteUrl: "http://localhost:8080/",
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: `gatsby-plugin-fastify`,
      options: {
        features: {
          headers: {
            customHeaders: {
              "/posts/page-1*": {
                "x-test-page-specific": "shows on /posts/page-1 and its page-data",
              },
              "/posts/page-2*": {
                "X-Content-Type-Options": "nosniff by default, overwritten for this page",
              },
              "/**": {
                "x-test-all-pages": "shows on every page/file",
              },
              "/icon.png": {
                "cache-control": "max-age=60000",
              },
              "/component*.js": {
                "x-test-js": "root js file",
                "x-cache-control": "overwrite cache-control for all root js files",
                "cache-control": "max-age=60000",
              },
              "/ssr/**": {
                "x-test-ssr-kept": "ssr page",
                "x-test-ssr-overwrite": "ssr page",
              },
              "/posts/page-1/index.html": {
                "x-test-page-specific": "shows on /posts/page-1 and its page-data (overwritten)",
              },
            },
            useDefaultCaching: true,
            useDefaultSecurity: true,
          },
        },
      },
    },
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-source-faker`,
      // derive schema from faker's options
      options: {
        schema: {
          lorem: ["words", "paragraphs", "slug"],
          name: ["firstName", "lastName"],
        },
        count: 3, // how many fake objects you need
        type: "NameData", // Name of the graphql query node
      },
    },
  ],
};
