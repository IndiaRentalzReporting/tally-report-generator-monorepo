import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist/node',
  format: ['cjs', 'esm'],
  target: 'node14',
  platform: 'node',
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true
});
