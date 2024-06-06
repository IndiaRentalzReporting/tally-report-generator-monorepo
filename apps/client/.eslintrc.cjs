/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@fullstack_package/eslint-config/react.js'],
  rules: {
    'import/extensions': 0
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  }
};
