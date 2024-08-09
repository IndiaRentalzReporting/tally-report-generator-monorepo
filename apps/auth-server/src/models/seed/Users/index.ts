import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchema from '@fullstack-package/dashboard-schemas';

const seedAdmin = async (
  db: PostgresJsDatabase<typeof dashboardSchema>,
  data: dashboardSchema.UserInsert
) => {
  await db.insert(dashboardSchema.UserSchema).values(data).returning();
};

export default seedAdmin;
