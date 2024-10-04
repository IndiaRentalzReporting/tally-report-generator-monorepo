/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@trg_package/eslint-config/vite.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    tsconfigRootDir: __dirname
  }
};
