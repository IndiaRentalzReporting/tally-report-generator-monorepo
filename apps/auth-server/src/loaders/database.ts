import { sql } from 'drizzle-orm';
import { DatabaseError } from '@trg_package/errors';
import db from '../models/auth';

export async function connectAndLog() {
  try {
    await db.execute(sql`SELECT NOW() AS now`);
    console.log('Connected to the PostgreSQL Auth Database');
  } catch (err) {
    throw new DatabaseError(`Error connecting to the PostgreSQL Database: ${err}`);
  }
}
