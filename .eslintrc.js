module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "standard",
    "standard-jsx",
    "standard-react",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    // "plugin:jsx-a11y/recommended",
    // "plugin:compat/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "import", "unused-imports"],
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"],
      },
    },
  },
  rules: {
    "eslint-comments/no-unused-disable": "error",
    // This rule make mean only when using "prop-type" library(https://ja.reactjs.org/docs/typechecking-with-proptypes.html)
    "react/prop-types": "off",
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#eslint-plugin-import
    "import/named": "off",
    "import/namespace": "off",
    "import/default": "off",
    "import/no-named-as-default-member": "off",
    indent: "off",
    "@typescript-eslint/indent": "off",
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-am-using-a-rule-from-eslint-core-and-it-doesnt-work-correctly-with-typescript-code
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    "no-undef": "off",
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    // in Next project, react need not be imported every file.
    "react/react-in-jsx-scope": "off",
    // API response is snake case.
    camelcase: "off",
    "react/display-name": "off",
    "sort-imports": "off",
    "import/order": ["warn", { alphabetize: { order: "asc" } }],
    "unused-imports/no-unused-imports": "error",
    "import/no-anonymous-default-export": [
      "warn",
      {
        allowCallExpression: false, // The true value here is for backward compatibility
        allowObject: true, // storybook may have unnamed object export
      },
    ],
    // Image component may not be used in this project
    "@next/next/no-img-element": "off",
  },
};
