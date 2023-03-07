---
"gatsby-source-s3": major
---

Upgraded the AWS SDK dependency in gatsby-source-s3 from v2 to v3.

AWS SDK v2 is going into maintenance mode in 2023, and projects which use the old version have error messages logged in their consoles.

The upgrade breaks backwards compatibility for existing plugin configurations, so a major version increment has been applied.

For plugin configuration, the AWS property follows the [S3ClientConfig interface](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html), but adds the additional `Buckets` property unique to the plugin.

The two main differences with the plugin configuration are:

1. `region` is now required for custom endpoints.
2. The `accessKeyId` and `secretAccessKey` properties have been moved into the `credentials` property.
