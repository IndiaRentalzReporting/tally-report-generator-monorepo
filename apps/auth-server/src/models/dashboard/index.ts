import { createClient } from '..';
import * as dashboard_schema from './schema';
import config from '../../config';

const { DASHBOARD_PG_URL } = config;

export let { db: dashboard_db, connection: dashboard_connection } =
  createClient(DASHBOARD_PG_URL, dashboard_schema);

export default dashboard_db;
