# gatsby-source-packagist

Integrate Packagist (PHP package repository) with the Gatsby GraphQL data layer. Configure your search query in the plugin config and access the results in GraphQL!

## Config

```js
{
  resolve: 'gatsby-source-packagist',
  options: {
    query: {
      // See API client docs for search params:
      // https://moonmeister.github.io/packagist-api-client/modules/_search_.html#search
      name: 'wp-graphql'
    },
    // This object is passed to the Github Rest API client when it's created.
    // More Info: https://octokit.github.io/rest.js/v17#usage
    githubApi: {
      auth: 'GitHubToken'
    }
  }
}
```

## Data

Access the data via 'packagistPackage' and 'allPackagistPackage' graphql data types.

Example query:

```graphql
{
  allPackagistPackage {
    totalCount
    nodes {
      name
      description
      url
      repository
      downloads
      favers
      readmeFile {
        # here you can access the Repositories Readme file.
        # Currently only github repositories are supported
        # if you have a markdown transformer installed that
        # should make `childMarkdownRemark` available to embed in your site.
      }
    }
  }
}

```
