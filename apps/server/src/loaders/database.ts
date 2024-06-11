import { sql } from 'drizzle-orm';
import db from '../models';

export async function connectAndLog() {
  try {
    await db.execute(sql`SELECT NOW() AS now`);
    console.log('Connected to the PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to the PostgreSQL database', err);
  }
}

/* import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);
const result = await db.select().from(...); */
