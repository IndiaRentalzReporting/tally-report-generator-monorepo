import config from './src/config';
import { defineConfig } from 'drizzle-kit';

const { AUTH_PG_URL } = config;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/auth/schema',
  out: './src/models/auth/migrations',
  dbCredentials: {
    url: AUTH_PG_URL
  },
  strict: true,
  verbose: true
});
