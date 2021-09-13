# Contributing

Welcome! Submit a PR, answer questions, join the [Discord](discord.gg/wr9xhj9v).

## Plugin Best Practices

### `package.json`: author vs. maintainer

We want to honor those who contribute to plugins, not just their original maintainers. Convert the normal 

```json
{
  "author": "Contributor name",
}
```

and replace it with:

```json
{
  "contributors": [
    "Christopher Burns",
    "Alex Moon",
    "Another Contributor"
  ],
}
```

We will eventually automate this so all PR authors/coontributors get added per plugin. 

### To build or not to build

Not all packages NEED to be run through Babel. Any project with a non-insignificant ammount of code should most likely be transpiled for compatability reasons. `babel-preset-gatsby-package` makes this easy but this does add a slight bit of maintenance over head. I'd default to adding transpilation to a package over not. Here is the minimial config for transpiling that a package will need.

```json
{
  "scripts": {
    "build": "babel src --out-dir . --ignore **/__tests__",
    "prepack": "cross-env NODE_ENV=production npm run build",
  },
  "devDependencies": {
    "@babel/cli": "^7.15.4",
    "@babel/core": "^7.15.5",
    "babel-preset-gatsby-package": "^1.13.0",
    "cross-env": "^7.0.3",
  }
}
```

### `package.json`:  repostitory, issues, and bugs
To make sure folks can find things please seup the fields correctly when the plugin is moved. 

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/gatsby-uc/plugins.git",
    "directory": "packages/gatsby-plugin-name"
  },
  "bugs": {
    "url": "https://github.com/gatsby-uc/plugins/issues"
  },
  "homepage": "https://github.com/gatsby-uc/plugins/packages/gatsby-plugin-name#readme",
}
```

### Prettier
Remove package specific prettier configs so the repository config is used. 

### Eslint
At this time the Repo doesn't have an opinion on this. We're open to it if someone has a suggestion on what this should be. 
