import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import config from '../config';

const { PG_URL } = config.postgres;

const client = postgres(PG_URL);
export const db = drizzle(client, { schema, logger: true });
