import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './schema';
import config from '../config';

neonConfig.webSocketConstructor = ws;
const { PG_URL } = config.postgres;

const pool = new Pool({ connectionString: PG_URL });
const db = drizzle(pool, { schema, logger: true });

export default db;
