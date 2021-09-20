
module.exports = {
  pathPrefix: "stuff",
  siteMetadata: {
    title: "Test Gatsby",
    siteUrl: "http://localhost:8080/",
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
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
  ],
};
