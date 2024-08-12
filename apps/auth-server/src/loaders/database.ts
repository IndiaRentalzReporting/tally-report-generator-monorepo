import { sql } from 'drizzle-orm';
import db from '../models/auth';

export const connectionCallback = async () => {
  await db.execute(sql`SELECT NOW() AS now`);
  console.log('Connected to the PostgreSQL Auth Database');
};
