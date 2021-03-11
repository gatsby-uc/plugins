# gatsby-plugin-github-ribbon

[![npm](https://img.shields.io/npm/v/gatsby-plugin-github-ribbon.svg?style=for-the-badge)](https://www.npmjs.com/package/gatsby-plugin-github-ribbon)
[![npm](https://img.shields.io/npm/dt/gatsby-plugin-github-ribbon.svg?style=for-the-badge)](https://www.npmjs.com/package/gatsby-plugin-github-ribbon)

Add the [Fork Me on Github](https://blog.github.com/2008-12-19-github-ribbons/) Ribbon to any Gatsby site.

## Install

```sh
$ npm install --save gatsby-plugin-github-ribbon

# or

$ yarn add gatsby-plugin-github-ribbon
```

## How to Use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-github-ribbon`,
    options: {
      project: `https://github.com/example/project`,
      color: `red`, //`red`, `green`, `darkblue`, `orange`, `gray`, or `white`.
      position: `left`, //`left` or `right`
    },
  },
]
```

## Options

**Position** can be: `left` or `right`.

**Color** can be: `red`, `green`, `darkblue`, `orange`, `gray`, or `white`.
