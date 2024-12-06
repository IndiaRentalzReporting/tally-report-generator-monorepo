import { defineConfig } from 'drizzle-kit';
import config from './src/config';

const { DASHBOARD_PG_URL } = config;

if (!DASHBOARD_PG_URL) throw new Error('Dashboard Database URL not provided');

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
