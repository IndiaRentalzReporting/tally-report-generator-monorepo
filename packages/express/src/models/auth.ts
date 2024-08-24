import * as authSchemas from '@trg_package/auth-schemas/schemas';
import { createClient } from '@trg_package/create-pg-client';
import config from '../config';

export const { AUTH_PG_URL } = config;

export const { client: authDb, connection: authConnection } = createClient(
  AUTH_PG_URL,
  authSchemas,
  {
    DB_MIGRATING: false,
    DB_SEEDING: false
  }
);
