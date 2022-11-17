const { defineConfig } = require("cypress");

module.exports = defineConfig({
  screenshotsFolder: "tests/screenshots",
  fixturesFolder: false,
  video: false,

  e2e: {
    supportFile: false,
    specPattern: "tests/e2e",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
