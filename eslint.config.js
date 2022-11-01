const ts_parser = require("@typescript-eslint/parser");
const babel_parser = require("@babel/eslint-parser");
const unicorn = require("eslint-plugin-unicorn");
const prettier = require("eslint-config-prettier");
const eslintConfig = require("eslint-config-eslint");

module.exports = [
  {
    // "eslint:recomended",
    plugins: {
      unicorn,
      prettier: {},
    },
    rules: {
      ...eslintConfig.recommended.rules,
      ...prettier.rules,
      ...unicorn.configs.recommended.rules,
    },
  },
  // {
  //   files: ["packages/*/gatsby-*.js"],
  //   languageOptions: {
  //     sourceType: "commonjs"
  //   }
  // },
  // {
  //   files: ["packages/**/src/**"],
  //   languageOptions: {
  //     ecmaVersion: "latest",
  //     sourceType: "module",
  //     parser: babel_parser,
  //     parserOptions: {
  //       requireConfigFile: false,
  //       babelOptions: {
  //         presets: ["babel-preset-gatsby-package"],
  //       },
  //     },
  //   },
  //   plugins: {
  //     "react": {},
  //   },
  // },
  // {
  //   languageOptions: {
  //     parser: ts_parser,
  //   },
  //   plugins: {
  //     "plugin:@typescript-eslint/recommended": {},
  //   },
  //   rules: {
  //     "@typescript-eslint/explicit-function-return-type": ["off"],
  //     "@typescript-eslint/explicit-module-boundary-types": ["off"],
  //   },
  // },
];
