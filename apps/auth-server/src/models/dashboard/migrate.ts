import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db, { dashboardConnection } from './index';
import drizzleConfig from '../../../drizzle.dashboard.config';

const main = async () => {
  await migrate(db, {
    migrationsFolder: drizzleConfig.out!
  });

  dashboardConnection.end();
};

main();
