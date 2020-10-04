const plugins = ["prettier", "@typescript-eslint"];

const configs = [
  "eslint:recommended",
  "prettier",
  "prettier/@typescript-eslint",
  "plugin:@typescript-eslint/recommended",
];

module.exports = {
  extends: configs,
  plugins: plugins,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.json",
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
  rules: {},
};
