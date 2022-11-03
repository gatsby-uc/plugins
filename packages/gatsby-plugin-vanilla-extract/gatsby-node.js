const { VanillaExtractPlugin } = require("@vanilla-extract/webpack-plugin");

exports.onCreateWebpackConfig = ({ actions }, pluginOptions) => {
  actions.setWebpackConfig({
    plugins: [new VanillaExtractPlugin(pluginOptions)],
  });
};
