import { defineConfig } from 'drizzle-kit';
import config, { DashboardPgUrlKey } from './src/config';

const DASHBOARD_PG_URL = config[DashboardPgUrlKey] ?? '';

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
