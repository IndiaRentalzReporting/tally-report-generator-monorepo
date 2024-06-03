import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import config from '../config';

const main = async () => {
  const { PG_URL } = config.postgres;
  const migrationClient = postgres(PG_URL, { max: 1 });
  await migrate(drizzle(migrationClient), { migrationsFolder: './migrations' });
  await migrationClient.end();
};

main();
