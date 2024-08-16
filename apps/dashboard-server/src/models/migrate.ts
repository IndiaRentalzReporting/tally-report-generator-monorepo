import { migrate } from 'drizzle-orm/postgres-js/migrator';
import dbClient, { dashboard_connection } from './index';
import drizzleConfig from '../../drizzle.config';

const main = async () => {
  await migrate(dbClient, {
    migrationsFolder: drizzleConfig.out!
  });

  dashboard_connection.end();
};

main();
