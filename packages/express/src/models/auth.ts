import * as authSchemas from '@trg_package/auth-schemas/schemas';
import { BaseServiceNew } from '@trg_package/base-service';
import config from '../config';

export const { AUTH_PG_URL } = config;

export const { client: authDb, connection: authConnection } =
  BaseServiceNew.createClient(AUTH_PG_URL, authSchemas, {
    DB_MIGRATING: false,
    DB_SEEDING: false
  });
