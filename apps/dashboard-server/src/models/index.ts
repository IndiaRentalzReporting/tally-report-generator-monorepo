import * as dashboard_schema from './schema';
import config from '../config';
import { BaseService } from '@fullstack_package/base-schemas/services';

const { PG_URL, DB_MIGRATING, DB_SEEDING } = config;

export let { db: dashboard_db, connection: dashboard_connection } =
  BaseService.createClient(PG_URL, dashboard_schema, {
    DB_MIGRATING,
    DB_SEEDING
  });

export default dashboard_db;
