import * as auth_schema from '@trg_package/auth-schemas/schemas';
import { BaseServiceNew } from '@trg_package/base-service';
import config from '../config';

const { AUTH_PG_URL } = config;

export const { client: auth_db, connection: auth_connection } =
  BaseServiceNew.createClient(AUTH_PG_URL, auth_schema, {
    DB_MIGRATING: false,
    DB_SEEDING: false
  });
