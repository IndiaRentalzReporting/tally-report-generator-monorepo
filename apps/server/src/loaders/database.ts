import { sql } from 'drizzle-orm';
import db from '../models';

export async function connectAndLog() {
  try {
    await db.execute(sql`SELECT NOW() AS now`);
    console.log('Connected to the PostgreSQL database');
  } catch (err) {
    console.error('Error connecting to the PostgreSQL database', err);
    throw err;
  }
}
