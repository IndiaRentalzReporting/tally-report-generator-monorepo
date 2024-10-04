import { BadRequestError } from '@trg_package/errors';
import { drizzle , PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

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
  URL: string,
  schema: T,
  options: {
    DB_MIGRATING: boolean;
    DB_SEEDING: boolean;
  }
): { client: PostgresJsDatabase<T>; connection: postgres.Sql } => {
  try {
    const connection = postgres(URL, {
      max: options.DB_MIGRATING || options.DB_SEEDING ? 1 : undefined
    });
    const client = drizzle(connection, {
      schema,
      logger: true
    });
    return {
      client,
      connection
    };
  } catch (e) {
    throw new BadRequestError(
      `Could not create Database client with URL - ${URL}: ${e}`
    );
  }
};
