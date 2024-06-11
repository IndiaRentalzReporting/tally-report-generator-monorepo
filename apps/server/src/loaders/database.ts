import postgres from 'postgres';
import config from '../config';

const { PG_URL } = config.postgres;

const client = postgres(PG_URL);

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

/* import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);
const result = await db.select().from(...); */
