import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db, { auth_connection } from './index';
import drizzleConfig from '../../../drizzle.auth.config';

const main = async () => {
  await migrate(db, {
    migrationsFolder: drizzleConfig.out!
  });

  auth_connection.end();
};

main();
