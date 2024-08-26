import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/services/index.ts', 'src/schemas/index.ts'],
    outDir: 'dist/node',
    format: ['cjs', 'esm'],
    target: 'node18',
    platform: 'node',
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: true
  },
  {
    entry: ['src/types/index.ts'],
    outDir: 'dist/types',
    format: ['cjs', 'esm'],
    target: 'es2020',
    platform: 'neutral',
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: true
  }
]);
