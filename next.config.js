// ! .storybook/main.js require this file, and the file is not accept import syntax.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { homepage } = require("./package.json");
module.exports = {
  basePath: homepage,
};
