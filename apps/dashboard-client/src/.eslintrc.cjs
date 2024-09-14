/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@trg_package/config-eslint/react.js'],
  rules: {
    'import/extensions': 0,
    'jsx-a11y/anchor-is-valid': 0
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  }
};
