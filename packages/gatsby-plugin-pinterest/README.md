<div align="center">
<h1>gatsby-plugin-pinterest</h1>

<p>Gatsby plugin to add Pinterest's add-on script. 📍</p>
</div>

---

<!-- prettier-ignore-start -->
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Show Save Button on hover](#show-save-button-on-hover)
  - [Manually show Save Button](#manually-show-save-button)
- [Inspiration](#inspiration)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```sh
npm install gatsby-plugin-pinterest
```

or

```sh
yarn add gatsby-plugin-pinterest
```

This library has a `peerDependencies` listing for [`gatsby`][gatsby].

## Usage

Use the `options` to configure the script with
[available attributes](https://developers.pinterest.com/docs/widgets/save/?#button-style-settings).

Note: not all attributes are supported in the plugin yet.
[See issues for more details](https://github.com/robinmetral/gatsby-plugin-pinterest/issues).

### Show Save Button on hover

```js
// In your gatsby-config.js

module.exports = {
  // Find the 'plugins' array
  plugins: [
    {
      resolve: `gatsby-plugin-pinterest`,
      options: {
        // If you just want to use the default, you can set this to `true`, defaults to `false`
        // This sets the data-pin-hover attribute in the script
        saveButton: {
          // Set to true to hide the text and display only a round P button
          round: false, // default
          // Set to true to display a bigger button
          tall: true, // default
        },
      },
    },

    // Other plugins here...
  ],
};
```

### Manually show Save Button

```js
// In your gatsby-config.js

module.exports = {
  // Find the 'plugins' array
  plugins: [
    {
      resolve: `gatsby-plugin-pinterest`,
    },
    // Other plugins here...
  ],
};
```

Then in your code:

```js
const pinType = "buttonPin"; // for one image or "buttonBookmark" for any image

// Optional parameters
// Source settings. See: https://developers.pinterest.com/docs/widgets/save/?#button-style-settings
const url = "https://mysite.com/sourdough-dinner-rolls";
const description = `&description="this is my favorite recipe for sourdough dinner rolls"`;
const mediaUrl = pinType === "buttonPin" ? `&media=https://mysite.com/images/dinner-rolls.png` : ""; // don't supply the mediaUrl for buttonBookmark

const to = `https://www.pinterest.com/pin/create/button/?url=${url}${description}${mediaUrl}`;

// Add this to your component where you want the button to appear
return <a href={to} target="_blank" rel="noreferrer" data-pin-do={pinType} />;
```

Manually add source settings like `url`, `description`, and `mediaUrl` since
[gatsby-image doesn't support custom image attributes](https://github.com/robinmetral/gatsby-plugin-pinterest/issues/30).

## Inspiration

Just like [`gatsby-plugin-twitter`][gatsby-plugin-twitter] and
[`gatsby-plugin-instagram-embed`][gatsby-plugin-instagram-embed] are doing for
the [Twitter][twitter] and [Instagram][instagram] embed scripts, this plugin
adds the [Pinterest][pinterest] embed script to your [`gatsby`][gatsby] site.

<!-- prettier-ignore-start -->
[npm]: https://npmjs.com
[node]: https://nodejs.org
[version-badge]: https://img.shields.io/npm/v/gatsby-plugin-pinterest.svg?style=flat-square
[package]: https://www.npmjs.com/package/gatsby-plugin-pinterest
[downloads-badge]: https://img.shields.io/npm/dm/gatsby-plugin-pinterest.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/gatsby-plugin-pinterest
[license-badge]: https://img.shields.io/npm/l/gatsby-plugin-pinterest.svg?style=flat-square
[license]: https://github.com/robinmetral/gatsby-plugin-pinterest/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/gatsby-uc/plugins/blob/main/CODE_OF_CONDUCT.md
[gatsby]: https://github.com/gatsbyjs/gatsby
[gatsby-plugin-instagram-embed]: https://github.com/MichaelDeBoey/gatsby-plugin-instagram-embed
[gatsby-plugin-twitter]: https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-twitter
[instagram]: https://instagram.com
[pinterest]: https://pinterest.com
[twitter]: https://twitter.com
<!-- prettier-ignore-end -->
