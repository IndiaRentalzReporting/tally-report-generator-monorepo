import * as auth_schema from '@trg_package/auth-schemas/schemas';
import { BaseService } from '@trg_package/base-service';
import config from '../config';

const { AUTH_PG_URL } = config;

export const { db: auth_db, connection: auth_connection } =
  BaseService.createClient(AUTH_PG_URL, auth_schema, {
    DB_MIGRATING: false,
    DB_SEEDING: false
  });
