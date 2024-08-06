/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@fullstack_package/eslint-config/express.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  }
};
