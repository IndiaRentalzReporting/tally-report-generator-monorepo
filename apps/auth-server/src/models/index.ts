import { BadRequestError } from '@trg_package/errors';
import { drizzle , PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import config from '@/config';

const { DASHBOARD_PG_HOST, DASHBOARD_PG_PORT } = config;

export const createUrl = ({
  db_username,
  db_password,
  db_name
}: {
  db_username: string;
  db_password: string;
  db_name: string;
}): string => `postgresql://${db_username}:${db_password}@${DASHBOARD_PG_HOST}:${DASHBOARD_PG_PORT}/${db_name}`;

export const createClient = <T extends Record<string, unknown>>(
  URL: string,
  schema: T
): { client: PostgresJsDatabase<T>; connection: postgres.Sql } => {
  try {
    const connection = postgres(URL);
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
