// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const sharedConfig = require("../../shared/jest.config");

module.exports = {
  ...sharedConfig,
  transformIgnorePatterns: ["/query-engine/", "/page-ssr/"],
  coveragePathIgnorePatterns: ["/query-engine/", "/page-ssr/"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/__utils__/setup-file.js"],
};
