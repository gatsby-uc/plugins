# gatsby-plugin-ackee-tracker

## Description

Easily add the Ackee Tracking script to your Gatsby site.

A Gatsby plugin that interacts with the GraphQL API of [Ackee](https://github.com/electerious/Ackee). Should be used to feed your server with data from your visitors.

## Dependencies

gatsby-plugin-ackee-tracker requires a running [Ackee server](https://github.com/electerious/Ackee).

## How to install

NPM
`npm install --save gatsby-plugin-ackee-tracker`

Yarn
`yarn add gatsby-plugin-ackee-tracker`

## Usage

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: "gatsby-plugin-ackee-tracker",
    options: {
      // Domatin ID found when adding a domain in the admin panel.
      domainId: "YOUR_ACKEE_DOMAIN_ID",
      // URL to Server eg: "https://analytics.test.com".
      server: "https://analytics.test.com",
      // Disabled analytic tracking when running localy
      ignoreLocalhost: true,
      // Enable or disable the tracking of your own visits (as identified by your login to the Ackee dashboard).
      ignoreOwnVisits: false,
      // If enabled it will collect info on OS, BrowserInfo, Device  & ScreenSize
      detailed: false,
    },
  },
];
```

## License

MIT
