# Contributing

Welcome! Submit a PR, answer questions, join the [Discord](https://discord.gg/gwnqfzetjv).

We have a monthly community meeting that is listed in the [Discord](https://discord.gg/gwnqfzetjv) server under events. The meeting is handled there in a voice channel. Anyone is welcome to come, listen, and join the conversation. The meeting is usually held on the last Tuesday of the month.

## Contributing a plugin

Thanks for considering doing so. We're always looking to expand the community and improve the Gatsby ecosystem. Your first question might very well be, "Why should I trust you and give you maintainer permissions on my NPM package?". Please know we're glad this is your first concern. We don't ever want to take security lightly.

### Security

Always feel free to open an issue or discussion and start a conversation around any concerns you have that this document may not answer. Second, my goal with this project has been to simplify deployments via automation. This means we'll always have a clear record of who wrote code, who approved code, and what code was deployed.

It is possible code can make it to NPM outside of the PR process. At this time, we're asking you to add `moonmeister`(Alex) to your NPM package. We won't ever ask you to relinquish your maintainer permissions, though you are welcome to do so, if you choose. Alex will in turn give the `@gatsby-uc/publishers` group on NPM maintainer permissions. `@gatsby-uc/publishers` is a small group of trusted folks. While maybe not ideal (open to suggestions here), allowing a number of trusted people to publish means no one person can bottle neck the process. This is the foundation on which the Gatsby User Collective was built.

### Repos

At this time we're assuming all contributed plugins will be rolled into the `gatsby-uc/plugins` repository. After transfering ownership a maintainer will help copy the code into the monorepo. This helps keep configs and tooling together all in one area.

The hard part of this is issues and PRs. For most of the plugins we've accepted so far these have been rare. The thought is when repos are submitted part of the process for merging will be working through PRs to close outdate/stale/bot ones and merge valuable ones. Issues will be combed through as well valid issues will at least get a comment pointing to the new repo, or we might attempt to move the issue.

The reality is we'll solve these problems as they come up. This is a community, ideas and suggestions are encouraged and welcomed.

### Your Access

When you contribute a plugin you will be added to the `gatsby-uc/maintainers` team so you'll retain permissions to merge PRs and edit your on plugin.

### Licence

The `plugins` has an MIT license on it. This matches what many Gatsby plugins also use. If your plugin is not MIT we can re-license it to MIT. BUT, no one here is a lawyer, and if you have significant contributions from other folks this could be something to think about. So, If you have chosen to license your repo differently we can add that to the plugin folder so it continues to live under that license. Again, we're not lawyers, but this should be ok.

## Give yourself some credit!!

We like to recognize folks for the work they do here. No matter the way or the amount they contribute. We use the [all-contributors](https://github.com/all-contributors/all-contributors) specification to do just that.

If you're submitting a PR you may use the [CLI](https://allcontributors.org/docs/en/cli/usage). We have made the CLI available via `yarn ac` in the project root.

If you are not working from a command line you can also give and request credit using the [@all-contributors](https://allcontributors.org/docs/en/bot/usage) bot.

For info on the types of things you may get or give credit for please see the [Contribution Types](https://allcontributors.org/docs/en/emoji-key) doc. We treat these as defined by the spec. Though the `plugin` type is exclusively given to folks who contribute a plugin to the Gatsby User Collective!

## Plugin Best Practices

Some of these are needed, some of these are nice to have, some of these don't really matter. Do your best and speak up if you want to challenge the status quo or have questions.

### `package.json`: author vs. maintainer

We want to honor those who contribute to plugins, not just their original maintainers. Convert the normal

```json
{
  "author": "Contributor name"
}
```

and replace it with:

```json
{
  "contributors": ["Christopher Burns", "Alex Moon", "Another Contributor"]
}
```

Maybe this will get automated so all PR authors/contributors get added per plugin. PS: this would be a great PR. ;P

### To build or not to build

Not all packages **need** to be run through Babel. Any project with a non-insignificant amount of code should most likely be transpiled for compatability reasons. `babel-preset-gatsby-package` makes this easy but this does add a slight bit of maintenance overhead. Here is the minimal config for transpiling that a package will need.

```json
{
  "scripts": {
    "build": "babel src --out-dir . --ignore **/__tests__",
    "prepack": "cross-env NODE_ENV=production npm run build"
  },
  "devDependencies": {
    "@babel/cli": "^7.15.4",
    "@babel/core": "^7.15.5",
    "babel-preset-gatsby-package": "^1.13.0",
    "cross-env": "^7.0.3"
  }
}
```

### `package.json`: repository, issues, and bugs

To make sure folks can find things please setup the fields correctly when the plugin is moved.

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
  "homepage": "https://github.com/gatsby-uc/plugins/packages/gatsby-plugin-name#readme"
}
```

### Prettier

Remove package specific prettier configs so the repository config is used.

### Eslint

At this time the Repo doesn't have an opinion on this. We're open to it if someone has a suggestion on what this should be.
