import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';
import * as schema from './schema';
import config from '../config';

const { PG_URL } = config.db.postgres;
const { NODE_ENV } = config;

let db: PostgresJsDatabase<typeof schema>;
const client = postgres(PG_URL);
db = drizzle(client, { schema, logger: true });

export default db;
