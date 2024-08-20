import { sql } from 'drizzle-orm';
import db from '../models';

export async function connectAndLog() {
  try {
    await db.execute(sql`SELECT NOW() AS now`);
    console.log('Connected to the PostgreSQL Dashboard Database');
  } catch (err) {
    console.error('Error connecting to the PostgreSQL Database:', err);
    throw err;
  }
}
