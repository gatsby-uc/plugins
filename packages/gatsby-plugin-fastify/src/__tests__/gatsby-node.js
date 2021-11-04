const { onPostBuild } = require("../gatsby-node");
const fs = require("fs-extra");

jest.mock("../utils/constants", () => ({
  ...jest.requireActual("../utils/constants"),
  PATH_TO_FUNCTIONS: "test-site/.cache/functions/",
  PATH_TO_PUBLIC: __dirname + "/__files__/public/",
  PATH_TO_CACHE: "test-site/.cache/",
  CONFIG_FILE_PATH: __dirname + "../../../test-site/.cache/",
}));

jest.mock("fs-extra", () => ({
  existsSync: jest.fn((path) => {
    if (path.includes(".cache/functions")) {
      return true;
    }
    return false;
  }),
  mkdir: jest.fn(),
  writeJSON: jest.fn(),
  readJSON: jest.fn((path) => {
    if (path.includes("manifest.json")) {
      return [
        {
          functionRoute: "splat/:splat",
          pluginName: "default-site-plugin",
          originalAbsoluteFilePath:
            "/Users/user/code/gatsby-uc/plugins/packages/gatsby-plugin-fastify/test-site/src/api/splat/:splat.js",
          originalRelativeFilePath: "splat/:splat.js",
          relativeCompiledFilePath: "splat/:splat.js",
          absoluteCompiledFilePath:
            "/Users/user/code/gatsby-uc/plugins/packages/gatsby-plugin-fastify/test-site/.cache/functions/splat/:splat.js",
        },
        {
          functionRoute: "test",
          pluginName: "default-site-plugin",
          originalAbsoluteFilePath:
            "/Users/user/code/gatsby-uc/plugins/packages/gatsby-plugin-fastify/test-site/src/api/test.js",
          originalRelativeFilePath: "test.js",
          relativeCompiledFilePath: "test.js",
          absoluteCompiledFilePath:
            "/Users/user/code/gatsby-uc/plugins/packages/gatsby-plugin-fastify/test-site/.cache/functions/test.js",
        },
      ];
    } else {
      throw new Error("Invalid path");
    }
  }),
}));

const pathPrefix = "/test";
const store = {
  getState: jest.fn(() => ({
    program: {
      directory: __dirname + "/__files__/",
    },
    pages: [
      {
        fakePage: "fakeValue",
        path: "/",
      },
      {
        matchPath: "/app/*",
        path: "/app/[...]/",
      },
      {
        path: "/ssr",
        mode: "SSR",
      },
      {
        path: "/my/dsg/path",
        mode: "DSG",
      },
    ],
    redirects: [
      {
        fromPath: "/perm-redirect",
        isPermanent: true,
        ignoreCase: true,
        redirectInBrowser: false,
        toPath: "/posts/page-1",
      },
      {
        fromPath: "/temp-redirect",
        isPermanent: false,
        ignoreCase: true,
        redirectInBrowser: false,
        toPath: "/posts/page-2",
      },
      {
        fromPath: "/alt-redirect",
        isPermanent: false,
        ignoreCase: true,
        redirectInBrowser: false,
        toPath: "/posts/page-3",
        statusCode: 307,
      },
    ],
  })),
};

const reporter = {
  error: jest.fn((_message, e) => {
    throw new Error(e);
  }),
};

const pluginOptions = {
  fakeOption: "fakeValue",
};

describe(`Gatsby Node API`, () => {
  it(`Should Build Config`, async () => {
    await onPostBuild({ store, reporter, pathPrefix }, pluginOptions);

    const writeJSONCall = fs.writeJSON.mock.calls[0];
    expect(fs.writeJSON).toHaveBeenCalledTimes(1);
    expect(writeJSONCall[0]).toContain(".cache/gatsby-plugin-fastify.json");
    expect(writeJSONCall[1]).toMatchSnapshot();
  });
});
