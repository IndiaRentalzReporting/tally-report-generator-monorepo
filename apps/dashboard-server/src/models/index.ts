import { Pool, neonConfig } from '@neondatabase/serverless';
import {
  PostgresJsDatabase,
  drizzle as pgDrizzle
} from 'drizzle-orm/postgres-js';
import {
  NeonDatabase,
  drizzle as neonDrizzle
} from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import postgres from 'postgres';
import * as schema from './schema';
import config from '../config';

const { PG_URL, NODE_ENV } = config;

type DBType<env extends string> = env extends 'development'
  ? PostgresJsDatabase<typeof schema>
  : NeonDatabase<typeof schema>;

let db: DBType<typeof NODE_ENV>;

if (NODE_ENV !== 'development') {
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: PG_URL });
  db = neonDrizzle(pool, { schema, logger: true });
} else {
  const client = postgres(PG_URL);
  db = pgDrizzle(client, { schema, logger: true });
}

export default db;
