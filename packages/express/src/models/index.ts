import { BadRequestError } from '@trg_package/errors';
import { drizzle , PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

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
