import fs from "fs-extra";
import mockPath from "node:path";
import { onPostBuild } from "../gatsby-node";

function mockPosixJoin(...paths) {
  return mockPath
    .join(...paths)
    .split(mockPath.sep)
    .join(mockPath.posix.sep);
}

jest.mock("../utils/constants", () => ({
  ...jest.requireActual("../utils/constants"),
  PATH_TO_FUNCTIONS: "../../integration-tests/plugin-fastify/.cache/functions/",
  PATH_TO_PUBLIC: process.cwd() + "/__files__/public/",
  PATH_TO_CACHE: "../../integration-tests/plugin-fastify/.cache/",
  CONFIG_FILE_PATH: "../../integration-tests/plugin-fastify/.cache/",
}));

jest.mock("fs-extra", () => ({
  existsSync: jest.fn((filePath) => {
    if (filePath.includes(mockPosixJoin(".cache", "functions"))) {
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
            "/Users/user/code/gatsby-uc/plugins/integration-tests/plugin-fastify/src/api/splat/:splat.js",
          originalRelativeFilePath: "splat/:splat.js",
          relativeCompiledFilePath: "splat/:splat.js",
          absoluteCompiledFilePath:
            "/Users/user/code/gatsby-uc/plugins/integration-tests/plugin-fastify/.cache/functions/splat/:splat.js",
        },
        {
          functionRoute: "test",
          pluginName: "default-site-plugin",
          originalAbsoluteFilePath:
            "/Users/user/code/gatsby-uc/plugins/integration-tests/plugin-fastify/src/api/test.js",
          originalRelativeFilePath: "test.js",
          relativeCompiledFilePath: "test.js",
          absoluteCompiledFilePath:
            "/Users/user/code/gatsby-uc/plugins/integration-tests/plugin-fastify/.cache/functions/test.js",
        },
      ];
    } else if (path.includes("webpack.stats.json")) {
      return {};
    } else {
      throw new Error("Invalid path");
    }
  }),
}));

const mockPages = [
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
];
const pathPrefix = "/test";
const store = {
  getState: jest.fn(() => ({
    program: {
      directory: "",
    },
    pages: mockPages,
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

jest.mock("../utils/plugin-data", () => ({
  ...jest.requireActual("../utils/plugin-data"),
  makePluginData: jest.fn(() => ({
    pages: new Map(Object.entries(mockPages).map(([key, value]) => [key, value])),
    components: [],
    manifest: [],
    program: {},
    pathPrefix: "",
    publicFolder: jest.fn(() => "/public"),
    functionsFolder: jest.fn((file) =>
      file ? mockPosixJoin(".cache", "functions", file) : mockPosixJoin(".cache", "functions")
    ),
    configFolder: jest.fn((file) =>
      file ? mockPosixJoin(".cache", file) : mockPosixJoin(".cache")
    ),
  })),
}));

const reporter = {
  error: jest.fn((_message, error) => {
    throw new Error(error);
  }),
};

const pluginOptions = {
  fakeOption: "fakeValue",
  features: {
    headers: {
      customHeaders: {},
      useDefaultCaching: false,
      useDefaultSecurity: false,
    },
  },
};

describe(`Gatsby Node API`, () => {
  it(`Should Build Config`, async () => {
    await onPostBuild({ store, reporter, pathPrefix }, pluginOptions);

    const writeJSONCall = fs.writeJSON.mock.calls[0];
    expect(fs.writeJSON).toHaveBeenCalledTimes(1);
    expect(writeJSONCall[0]).toContain(mockPosixJoin(".cache", "gatsby-plugin-fastify.json"));
    expect(writeJSONCall[1]).toMatchSnapshot();
  });
});
