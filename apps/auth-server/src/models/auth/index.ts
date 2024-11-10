import * as authSchemas from '@trg_package/schemas-auth/schemas';
import { createClient } from '@/models';
import config from '../../config';

export const { AUTH_PG_URL, DB_MIGRATING, DB_SEEDING } = config;

export const { client: authDb, connection: authConnection } = createClient(
  AUTH_PG_URL,
  authSchemas,
  { DB_MIGRATING, DB_SEEDING }
);

export default authDb;
