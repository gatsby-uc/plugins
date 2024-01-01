import * as path from "path";
import type { GatsbyNode, GatsbyConfig } from "gatsby";
import { applyTrailingSlashOption } from "./utils";

const TRAILING_SLASH = (process.env.TRAILING_SLASH || `never`) as GatsbyConfig["trailingSlash"];

export const createPages: GatsbyNode["createPages"] = ({
  actions: { createRedirect, createSlice },
}) => {
  // TODO - Gatsby didn't write tests for proxies. Generally review tests for missing cases vs old fastify plugin tests.

  createRedirect({
    fromPath: applyTrailingSlashOption("/redirect", TRAILING_SLASH),
    toPath: applyTrailingSlashOption("/routes/redirect/hit", TRAILING_SLASH),
  });
  createRedirect({
    fromPath: applyTrailingSlashOption("/routes/redirect/existing", TRAILING_SLASH),
    toPath: applyTrailingSlashOption("/routes/redirect/hit", TRAILING_SLASH),
  });

  createSlice({
    id: `footer`,
    component: path.resolve(`./src/components/footer.jsx`),
    context: {},
  });
};
