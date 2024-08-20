import * as dashboard_schema from './schema';
import config from '../config';
import { BaseServiceNew } from '@trg_package/base-service';

const { PG_URL, DB_MIGRATING, DB_SEEDING } = config;

export let { client: dashboard_db, connection: dashboard_connection } =
  BaseServiceNew.createClient(PG_URL, dashboard_schema, {
    DB_MIGRATING,
    DB_SEEDING
  });

export default dashboard_db;
