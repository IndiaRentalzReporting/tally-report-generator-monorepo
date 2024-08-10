import { createClient } from '..';
import * as dashboard_schema from './schema';
import config, { DashboardPgUrlKey } from '../../config';

const DASHBOARD_PG_URL = config[DashboardPgUrlKey];

if (!DASHBOARD_PG_URL) {
  throw new Error('Dashboard database URL not provided');
}

export let { db: dashboard_db, connection: dashboard_connection } =
  createClient(DASHBOARD_PG_URL, dashboard_schema);

export default dashboard_db;
