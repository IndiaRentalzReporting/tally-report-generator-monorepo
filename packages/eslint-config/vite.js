const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'turbo',
    'airbnb',
    'prettier',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    React: true,
    JSX: true
  },
  env: {
    node: true,
    browser: true
  },
  plugins: ['only-warn', 'turbo', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      typescript: {
        project
      }
    }
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/'
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }]
};
