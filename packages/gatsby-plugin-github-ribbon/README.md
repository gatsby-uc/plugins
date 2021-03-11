# gatsby-plugin-github-ribbon

[![npm](https://img.shields.io/npm/v/gatsby-plugin-github-ribbon.svg?style=for-the-badge)](https://www.npmjs.com/package/gatsby-plugin-github-ribbon)
[![npm](https://img.shields.io/npm/dt/gatsby-plugin-github-ribbon.svg?style=for-the-badge)](https://www.npmjs.com/package/gatsby-plugin-github-ribbon)
[![Travis (.org) branch](https://img.shields.io/travis/moonmeister/gatsby-plugin-github-ribbon/master.svg?style=for-the-badge)](https://travis-ci.org/moonmeister/gatsby-plugin-github-ribbon)
[![Coveralls github branch](https://img.shields.io/coveralls/github/moonmeister/gatsby-plugin-github-ribbon/master.svg?style=for-the-badge)](https://coveralls.io/github/moonmeister/gatsby-plugin-github-ribbon?branch=master)

Add the [Fork Me on Github](https://blog.github.com/2008-12-19-github-ribbons/) Ribbon to any Gatsby site.

## Install

`npm install --save gatsby-plugin-github-ribbon`

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
