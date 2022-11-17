const ts_parser = require("@typescript-eslint/parser");
const babel_parser = require("@babel/eslint-parser");
const unicorn = require("eslint-plugin-unicorn");
const prettier = require("eslint-config-prettier");

module.exports = [
  // "eslint:recomended",
  {
    plugins: {
      unicorn,
      prettier: {},
    },
    rules: {
      ...prettier.rules,
      "unicorn/prefer-node-protocol": "error",
      // ...unicorn.configs.recommended.rules,
    },
  },
  {
    files: ["packages/*/gatsby-*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    files: ["packages/**/src/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babel_parser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["babel-preset-gatsby-package"],
        },
      },
    },

    plugins: {
      react: {},
    },
  },
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
