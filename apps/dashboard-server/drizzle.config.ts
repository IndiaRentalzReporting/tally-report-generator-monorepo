import { defineConfig } from 'drizzle-kit';
import config from './src/config';

const { PG_URL } = config;

console.log(PG_URL);
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
