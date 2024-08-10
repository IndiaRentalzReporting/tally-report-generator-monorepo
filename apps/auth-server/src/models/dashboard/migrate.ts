import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db, { dashboard_connection } from './index';
import drizzleConfig from '../../../drizzle.dashboard.config';

const main = async () => {
  await migrate(db, {
    migrationsFolder: drizzleConfig.out!
  });

  dashboard_connection.end();
};

main();
