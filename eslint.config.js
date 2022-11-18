const ts_parser = require("@typescript-eslint/parser");
const babel_parser = require("@babel/eslint-parser");
const unicorn = require("eslint-plugin-unicorn");
const prettier = require("eslint-config-prettier");
const react = require("eslint-plugin-react");
const typescript = require("@typescript-eslint/eslint-plugin");

module.exports = [
  // "eslint:recomended",
  {
    ignores: ["**/dist", "**/*.config.js", "**/coverage"],
  },
  {
    plugins: {
      unicorn,
      prettier,
    },
    rules: {
      ...prettier.rules,
      ...unicorn.configs.recommended.rules,
    },
  },
  {
    files: ["packages/*/gatsby-*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      "unicorn/prefer-module": "off",
    },
  },
  {
    files: ["packages/**/*.js"],
    settings: {
      react: {
        version: "18",
      },
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babel_parser,
      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
    },
    plugins: {
      react,
    },
  },
  {
    files: ["packages/**/*.ts"],
    languageOptions: {
      parser: ts_parser,
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
    },
  },
];
