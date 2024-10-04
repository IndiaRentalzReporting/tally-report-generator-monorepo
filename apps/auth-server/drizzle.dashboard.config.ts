import { BadRequestError } from '@trg_package/errors';
import { defineConfig } from 'drizzle-kit';
import config, { DashboardPgUrlKey } from './src/config';

let DASHBOARD_PG_URL = config[DashboardPgUrlKey];
const { DB_MIGRATING } = config;

if (!DASHBOARD_PG_URL) {
  if (DB_MIGRATING) {
    throw new BadRequestError('Dashboard database URL not provided');
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
