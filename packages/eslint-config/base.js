/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'turbo',
    'prettier',
    'airbnb-base/legacy',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['only-warn', 'turbo', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '.*.js',
    '*.setup.js',
    '*.config.js',
    '.turbo/',
    'dist/',
    'coverage/',
    'node_modules/'
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }]
};
