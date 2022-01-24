# gatsby-starter-source-s3

This starter is an example of how to source objects from AWS S3 in a Gatsby site
at build time, using `@robinmetral/gatsby-source-s3`.

It uses a local version of the plugin located in `/src`, and it can be used for
local development and testing.

To run it locally, you'll need to add the following environment variables in a
`.env` file:

```bash
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
```

## AWS S3 setup

This site sources images from three separate buckets:

1. gatsby-source-s3-example (public)
2. gatsby-source-s3-example-2 (public)
3. gatsby-source-s3-continuation-token (private)

The first two buckets are set up for public access with the following policy:

```json
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::gatsby-source-s3-example/*"
    }
  ]
}
```

_Note: the resource is the bucket's arn with the `/*` scope._

The third bucket is private, its policy is the default for S3 (i.e. nothing was
changed when creating the bucket).

## AWS IAM setup

The AWS access keys used by this example are for a `gatsby-source-s3` user to
which I attached the following access policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::gatsby-source-s3-example",
        "arn:aws:s3:::gatsby-source-s3-example-2",
        "arn:aws:s3:::gatsby-source-s3-continuation-token"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": [
        "arn:aws:s3:::gatsby-source-s3-example/*",
        "arn:aws:s3:::gatsby-source-s3-example-2/*",
        "arn:aws:s3:::gatsby-source-s3-continuation-token/*"
      ]
    }
  ]
}
```
