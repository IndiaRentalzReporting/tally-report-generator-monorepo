/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@trg_package/config-eslint/express.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  }
};
