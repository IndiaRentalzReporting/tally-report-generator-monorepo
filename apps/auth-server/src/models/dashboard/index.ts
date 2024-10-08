import { createClient } from '@trg_package/pg-client';
import { BadRequestError } from '@trg_package/errors';
import * as dashboardSchemas from './schema';
import config, { DashboardPgUrlKey } from '../../config';

const DASHBOARD_PG_URL = config[DashboardPgUrlKey];
const { DB_MIGRATING, DB_SEEDING } = config;

if (!DASHBOARD_PG_URL) {
  throw new BadRequestError('Dashboard database URL not provided');
}

export const { client: dashboardDb, connection: dashboardConnection } = createClient(DASHBOARD_PG_URL, dashboardSchemas, {
  DB_MIGRATING,
  DB_SEEDING
});

export default dashboardDb;
