require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: `source-s3`,
  },
  plugins: [
    {
      resolve: `gatsby-source-s3`,
      options: {
        aws: {
          accessKeyId: "minioadmin",
          secretAccessKey: "minioadmin",
          s3ForcePathStyle: true,
          endpoint: "localhost:9001",
          sslEnabled: false,
          s3ForcePathStyle: true,
        },
        buckets: [
          "gatsby-source-s3-example",
          "gatsby-source-s3-example-2",
          "gatsby-source-s3-continuation-token",
        ],
      },
    },
    // the sharp transformer and plugin are required to process images
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
};
