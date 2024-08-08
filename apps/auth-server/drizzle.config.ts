import config from './src/config';
import { defineConfig } from 'drizzle-kit';

const { PG_URL } = config.db.postgres;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/schema',
  out: './src/models/migrations',
  dbCredentials: {
    url: PG_URL
  },
  strict: true,
  verbose: true
});
