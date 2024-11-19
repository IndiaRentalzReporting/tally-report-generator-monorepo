import * as authSchemas from './schema';
import { createClient } from '../../models';
import config from '../../config';

export const { AUTH_PG_URL } = config;

export const { client: authDb, connection: authConnection } = createClient(
  AUTH_PG_URL,
  authSchemas
);
