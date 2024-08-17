import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/services/index.ts', 'src/schemas/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  clean: true,
  splitting: true,
  sourcemap: true
});
