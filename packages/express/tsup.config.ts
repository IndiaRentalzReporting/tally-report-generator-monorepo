import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['express'], // Bundle express
  external: ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock'],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.html': 'text' // Treat HTML files as text
    };
  }
});
