/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './base.js',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:node/recommended'
  ],
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-redeclare': 'off'
  },
  env: {
    node: true
  }
};
