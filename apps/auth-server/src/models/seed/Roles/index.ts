import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchema from '@fullstack-package/dashboard-schemas';
import role from './data.json';

const seedRole = async (
  db: PostgresJsDatabase<typeof dashboardSchema>
): Promise<string> => {
  const [superuser] = await db
    .insert(dashboardSchema.RoleSchema)
    .values(role)
    .returning();

  return superuser?.id!;
};

export default seedRole;
