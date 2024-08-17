import * as auth_schema from './schema';
import config from '../../config';
import { BaseService } from '@trg_package/base-service';

const { AUTH_PG_URL, DB_MIGRATING, DB_SEEDING } = config;

export let { db: auth_db, connection: auth_connection } =
  BaseService.createClient(AUTH_PG_URL, auth_schema, {
    DB_MIGRATING,
    DB_SEEDING
  });

export default auth_db;
