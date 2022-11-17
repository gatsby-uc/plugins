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
      options: {},
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
