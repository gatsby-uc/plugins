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
          credentials: {
            accessKeyId: "minioadmin",
            secretAccessKey: "minioadmin",
          },
          forcePathStyle: true,
          endpoint: "http://localhost:9001",
          sslEnabled: false,
          region: "us-east-1",
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
