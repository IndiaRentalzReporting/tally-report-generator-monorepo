import { defineConfig } from 'drizzle-kit';
import config from './src/config';

const { PG_URL } = config.postgres;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/schema.ts',
  out: './src/models/migrations',
  dbCredentials: {
    url: PG_URL
  },
  strict: true,
  verbose: true
});
