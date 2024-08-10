import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import config from '../config';

const { DB_MIGRATING, DB_SEEDING } = config;

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
