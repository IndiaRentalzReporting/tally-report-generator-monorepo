import * as dashboard_schema from './schema';
import config, { DashboardPgUrlKey } from '../../config';
import { BaseServiceNew } from '@trg_package/base-service';

const DASHBOARD_PG_URL = config[DashboardPgUrlKey];
const { DB_MIGRATING, DB_SEEDING } = config;

if (!DASHBOARD_PG_URL) {
  throw new Error('Dashboard database URL not provided');
}

export let { client: dashboardDb, connection: dashboardConnection } =
  BaseServiceNew.createClient(DASHBOARD_PG_URL, dashboard_schema, {
    DB_MIGRATING,
    DB_SEEDING
  });

export default dashboardDb;
