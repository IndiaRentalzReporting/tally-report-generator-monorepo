import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchema from '@fullstack-package/dashboard-schemas';
import actions from './data.json';

const seedActions = async (db: PostgresJsDatabase<typeof dashboardSchema>) => {
  const promises = actions.map(async ({ name }) => {
    await db.insert(dashboardSchema.ActionSchema).values({ name }).returning();
  });
  await Promise.all(promises);
};

export default seedActions;
