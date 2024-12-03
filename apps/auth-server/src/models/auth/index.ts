import * as authSchemas from '@trg_package/schemas-auth/schemas';
import { createClient } from '../index';
import config from '../../config';

export const { AUTH_PG_URL } = config;

export const { client: authDb, connection: authConnection } = createClient(
  AUTH_PG_URL,
  authSchemas
);

export default authDb;
