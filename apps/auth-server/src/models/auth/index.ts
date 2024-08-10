import { createClient } from '..';
import * as auth_schema from './schema';
import config from '../../config';

const { AUTH_PG_URL } = config;

export let { db: auth_db, connection: auth_connection } = createClient(
  AUTH_PG_URL,
  auth_schema
);

export default auth_db;
