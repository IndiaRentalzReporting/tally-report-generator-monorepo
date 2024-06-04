import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import config from '../config';
import * as schema from '../models/schema';

const { PG_URL } = config.postgres;

const client = postgres(PG_URL);
export const db = drizzle(client, { schema, logger: true });

export async function connectAndLog() {
  try {
    await client`SELECT NOW() AS now`;
    console.log('Connected to the PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to the PostgreSQL database', err);
  } finally {
    await client.end();
  }
}
