import { migrate } from 'drizzle-orm/postgres-js/migrator';
import db, { authConnection } from './index';
import drizzleConfig from '../../../drizzle.auth.config';

const main = async () => {
  await migrate(db, {
    migrationsFolder: drizzleConfig.out!
  });

  authConnection.end();
};

main();
