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
  settings: {
    'import/resolver': {
      typescript: {
        project
      }
    }
  },
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/comma-spacing': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'react/no-danger': 'off',
    'react/require-default-props': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'import/prefer-default-export': 'off'
  },
  plugins: ['only-warn', 'turbo', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.*.js', 'node_modules/'],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }]
};
