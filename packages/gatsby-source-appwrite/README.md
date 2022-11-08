# gatsby-source-appwrite

<table align="center">
  <tr>
    <td valign="top"><img height="100px" width="100px" src="https://res.cloudinary.com/practicaldev/image/fetch/s--Fda3jJaA--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://dev-to-uploads.s3.amazonaws.com/uploads/organization/profile_image/2653/80840bff-1061-4544-841e-86da7aa1dd8e.png"></td>
    <td valign="top"> <img height="100px" width="100px" src="https://res.cloudinary.com/practicaldev/image/fetch/s--hsQ1oxcF--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://dev-to-uploads.s3.amazonaws.com/uploads/organization/profile_image/2225/18b2c66e-fba2-4f4f-8196-8184c599b75d.png"></td>
  </tr>
</table>

Gatsby source plugin for building websites using Appwrite as a data source

## How to install

```
npm install gatsby-source-appwrite node-appwrite
```

## Available options

- `appwriteEndpoint` - the url of your endpoint
- `appwriteProject` - appwrite project id
- `appwriteApiKey` - api key of your appwrite project, with correct access rights

## Examples of usage

[Queries](https://appwrite.io/docs/databases#querying-documents)

```js
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-appwrite`,
      options: {
        appwriteEndpoint: "http://localhost/v1",
        appwriteProject: "my-project",
        appwriteApiKey: "my-api-key",
        types: [
          {
            type: "Todo",
            query: (databases) => databases.listDocuments("my-database-id", "my-collection-id"),
          },
        ],
        types: [
          {
            type: "Movies",
            query: (databases) =>
              databases.listDocuments("my-database-id", "my-collection-id", [
                Query.equal("title", "Avatar"),
              ]),
          },
        ],
      },
    },
  ],
};
```

## How to query for data

```
query MyQuery {
  appwriteTodo {
    id
    databaseId
    name
  }
}
```

Will result with:

```
{
  "data": {
    "appwriteTodo": {
      "id": "4fb16cb4-916f-5bca-baee-e7763936d272",
      "databaseId": "6359a5cdc905610fb81e",
      "name": "Hey Hey"
    }
  },
  "extensions": {}
}
```
