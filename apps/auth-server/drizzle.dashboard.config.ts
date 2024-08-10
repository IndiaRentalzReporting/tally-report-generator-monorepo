import config, { DashboardPgUrlKey } from './src/config';
import { defineConfig } from 'drizzle-kit';

let DASHBOARD_PG_URL = config[DashboardPgUrlKey];
const { DB_MIGRATING } = config;

if (!DASHBOARD_PG_URL) {
  if (DB_MIGRATING) {
    throw new Error('Dashboard database URL not provided');
  } else {
    DASHBOARD_PG_URL = '';
  }
}

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
