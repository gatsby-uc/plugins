const { onPostBuild } = require("../gatsby-node");
const fs = require("fs-extra");

jest.mock("../../utils/constants", () => ({
  ...jest.requireActual("../utils/constants"),
  PATH_TO_FUNCTIONS: "test-site/.cache/functions/",
  PATH_TO_PUBLIC: __dirname + "/__files__/public/",
  PATH_TO_CACHE: "test-site/.cache/",
  CONFIG_FILE_PATH: __dirname + "../../../test-site/.cache/",
}));

jest.mock("fs-extra", () => ({
  ...jest.requireActual("fs-extra"),
  mkdir: jest.fn(),
  writeJSON: jest.fn(),
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
  it(`Should Build stuff`, async () => {
    await onPostBuild({ store, reporter, pathPrefix }, pluginOptions);

    expect(fs.writeJSON).toHaveBeenCalledTimes(1);
    expect(fs.writeJSON).toMatchSnapshot();
  });
});
