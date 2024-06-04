import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import config from '../config';

const { PG_URL } = config.postgres;
const migrationClient = postgres(PG_URL, { max: 1 });

const main = async () => {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: './src/models/migrations'
  });
  await migrationClient.end();
};

main();
