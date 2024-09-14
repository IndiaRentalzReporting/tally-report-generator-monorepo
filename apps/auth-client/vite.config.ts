import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), tsConfigPaths()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        $: path.resolve(__dirname, '../../packages/components/src')
      }
    },
    server: {
      port: Number(process.env.VITE_PORT),
      host: true
    },
    preview: {
      port: Number(process.env.VITE_PORT),
      host: true
    }
  });
};
