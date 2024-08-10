import config from './src/config';
import { defineConfig } from 'drizzle-kit';

const { DASHBOARD_PG_URL } = config;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/dashboard/schema',
  out: './src/models/dashboard/migrations',
  dbCredentials: {
    url: DASHBOARD_PG_URL
  },
  strict: true,
  verbose: true
});
