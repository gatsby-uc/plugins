[![npm](https://img.shields.io/npm/v/gatsby-plugin-readingtime)](https://www.npmjs.com/package/gatsby-plugin-readingtime)

# gatsby-plugin-readingtime

Get reading time estimates for any content from any source in your Gatsby project's GraphQL schema.

## Install

`npm i gatsby-plugin-readingtime`


`yarn add gatsby-plugin-readingtime`

## config

```js:title=gatsby-config.js
{
  plugins: [
    {
      resolve: `gatsby-plugin-readingtime`,
      options: {
        config: { 
          // configuration for reading-time package https://github.com/ngryman/reading-time
        },
        types: {
          // Key: GraphQL Type to add reading times to, Value: Resolver function takes source node of Defined GraphQL type and returns content to be processed.
          WpPost: source => {
            const { blocks } = source;
            return blocks.map(block => block.saveContent).join('');
          }, 
        },
      },
    },
  ]
}
```
