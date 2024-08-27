import type { Config } from 'tailwindcss';
import sharedConfig from '@trg_package/tailwind-config';

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/App.tsx'],
  presets: [sharedConfig]
};

export default config;
