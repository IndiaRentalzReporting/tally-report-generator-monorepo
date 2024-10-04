/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@trg_package/eslint-config/express.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
};
