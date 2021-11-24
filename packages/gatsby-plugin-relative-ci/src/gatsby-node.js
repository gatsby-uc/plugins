const { RelativeCiAgentWebpackPlugin } = require("@relative-ci/agent");

export const onCreateWebpackConfig = ({ stage, actions }, pluginOptions) => {
  if (stage === "build-javascript") {
    actions.setWebpackConfig({
      plugins: [new RelativeCiAgentWebpackPlugin(pluginOptions)],
    });
  }
};
