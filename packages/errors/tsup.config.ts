import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    target: 'node18',
    platform: 'node',
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: true
  }
]);
