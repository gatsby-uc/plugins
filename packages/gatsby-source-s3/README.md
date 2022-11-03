# gatsby-source-s3

A Gatsby plugin to source objects and images from AWS S3.

## Getting started

### Gatsby setup

Install the plugin:

```bash
# with npm
npm install gatsby-source-s3
# with yarn
yarn add gatsby-source-s3
```

Declare it in your `gatsby-config.js`, making sure to pass your AWS credentials
as
[environment variables](https://www.gatsbyjs.org/docs/environment-variables/):

```javascript
// gatsby-config.js
require("dotenv").config();

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-s3`,
      options: {
        aws: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        },
        buckets: ["my-bucket", "my-second-bucket"],
        expiration: 120,
      },
    },
  ],
};
```

The value of expiration specifies the time after which signed requests to S3 will expire. The default value is 15 minutes (the default for AWS pre-signed URL operations). Feel free to increase if you have many or large images and start to see errors similar to "HTTPError: Response code 403 (Forbidden)" during build. This option is not compulsory.

### AWS setup

You can use the plugin both with private and public buckets.

We recommend creating an IAM user to use with this plugin, and attach an IAM
policy to access specific buckets.

The policy needs to allow `ListBucket` on buckets and `GetObject` on bucket
contents (`/*`). For example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::gatsby-source-s3-example",
        "arn:aws:s3:::gatsby-source-s3-example-2"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": [
        "arn:aws:s3:::gatsby-source-s3-example/*",
        "arn:aws:s3:::gatsby-source-s3-example-2/*"
      ]
    }
  ]
}
```

## Querying S3 objects

S3 objects can be queried in GraphQL as "s3Object" or "allS3Object":

```graphql
query AllObjectsQuery {
  allS3Object {
    nodes {
      Key # the object's key, i.e. file name
      Bucket # the object's bucket name on S3
      LastModified # the date the object was last modified
      Size # the object's size in bytes
      localFile # the local file node for image objects processed with sharp (see below)
    }
  }
}
```

### Processing images with sharp

Any images in your bucket(s) will be downloaded by the plugin and stored as
local file nodes, to be processed with `gatsby-plugin-sharp` and
`gatsby-transformer-sharp`.

If you don't have them yet, you will need to add the sharp plugin and
transformer to your Gatsby site:

```bash
# with npm
npm install gatsby-plugin-sharp gatsby-transformer-sharp
# with yarn
yarn add gatsby-plugin-sharp gatsby-transformer-sharp
```

```javascript
// gatsby-config.js
module.exports = {
  plugins: [
    // ...
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
```

You can then query the processed images with GraphQL:

```graphql
query AllImagesQuery {
  images: allS3Object {
    nodes {
      Key
      localFile {
        childImageSharp {
          fluid(maxWidth: 1024) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
}
```

And use them with `gatsby-image`:

```javascript
import Img from "gatsby-image";

const Image = ({ s3Object }) => <Img fluid={s3Object.localFile.childImageSharp.fluid} />;
```

## Thanks

This plugin was initially based on Dustin Schau's
[`gatsby-source-s3`](https://github.com/DSchau/gatsby-source-s3/) and influenced
by Jesse Stuart's TypeScript
[`gatsby-source-s3-image`](https://github.com/jessestuart/gatsby-source-s3-image).
