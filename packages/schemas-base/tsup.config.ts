import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/schemas/index.ts'],
    outDir: 'dist/node',
    format: ['cjs', 'esm'],
    target: 'node18',
    platform: 'node',
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: true
  }
]);
