import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ConnectionManager } from './ConnectionManager';

export const createUrl = ({
  db_username,
  db_password,
  db_name
}: {
  db_username: string;
  db_password: string;
  db_name: string;
}): string => `postgresql://${db_username}:${db_password}@localhost:5432/${db_name}`;

export const createClient = <T extends Record<string, unknown>>(
  tenantId: string,
  URL: string,
  schema: T,
  options: {
    DB_MIGRATING: boolean;
    DB_SEEDING: boolean;
  }
): { client: PostgresJsDatabase<T>; connection: postgres.Sql } => {
  const connectionManager = ConnectionManager.getInstance();
  return connectionManager.getOrCreateConnection(tenantId, URL, schema, options);
};
