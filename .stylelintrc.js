module.exports = {
  plugins: ["stylelint-declaration-block-no-ignored-properties"],
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended",
    "stylelint-config-prettier",
    "stylelint-config-sass-guidelines",
    "stylelint-config-styled-components",
    // "stylelint-config-recess-order",
  ],
  rules: {
    "font-family-no-missing-generic-family-keyword": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "declaration-block-trailing-semicolon": "always",
    "selector-pseudo-element-colon-notation": "double",
    "plugin/declaration-block-no-ignored-properties": true,
    // for material UI CSS in JS object style
    "selector-type-case": null,
    "selector-type-no-unknown": null,
    "rule-empty-line-before": null,
    "value-keyword-case": null,
    "property-no-unknown": null,
    "max-nesting-depth": 2,
    "string-quotes": "double",
  },
  reportNeedlessDisables: true,
  reportInvalidScopeDisables: true,
};
