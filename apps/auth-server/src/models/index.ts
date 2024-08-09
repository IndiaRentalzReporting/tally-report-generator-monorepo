import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as auth_schema from './schema';
import config from '../config';

export const createClient = <T extends Record<string, unknown>>(
  URL: string,
  schema: T
): { db: PostgresJsDatabase<T>; connection: postgres.Sql<{}> } => {
  const connection = postgres(URL, {
    max: DB_MIGRATING || DB_SEEDING ? 1 : undefined
  });
  return {
    db: drizzle(connection, {
      schema,
      logger: true
    }),
    connection
  };
};

const { AUTH_PG_URL, DB_MIGRATING, DB_SEEDING } = config;

export let { db: auth_db, connection: auth_connection } = createClient(
  AUTH_PG_URL,
  auth_schema
);

export default auth_db;
