import { BadRequestError } from '@trg_package/errors';
import { createClient } from '../index';
import * as dashboardSchemas from './schema';
import config, { DashboardPgUrlKey } from '../../config';

const DASHBOARD_PG_URL = config[DashboardPgUrlKey];

if (!DASHBOARD_PG_URL) {
  throw new BadRequestError('Dashboard database URL not provided');
}

export const { client: dashboardDb, connection: dashboardConnection } = createClient(
  DASHBOARD_PG_URL,
  dashboardSchemas
);

export default dashboardDb;
