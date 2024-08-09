import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchema from '@fullstack-package/dashboard-schemas';
import modules from './data.json';

const seedModules = async (db: PostgresJsDatabase<typeof dashboardSchema>) => {
  const promises = modules.map(async ({ name }) => {
    await db.insert(dashboardSchema.ModuleSchema).values({ name }).returning();
  });
  await Promise.all(promises);
};

export default seedModules;
