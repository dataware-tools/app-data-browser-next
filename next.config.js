// ! .storybook/main.js require this file, and the file is not accept import syntax.
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { homepage } = require("./package.json");
/* eslint-enable @typescript-eslint/no-var-requires */
module.exports = {
  basePath: homepage,
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.resolve.modules = [path.resolve(__dirname, "src"), "node_modules"];
    return config;
  },
  eslint: { ignoreDuringBuilds: true },
};
