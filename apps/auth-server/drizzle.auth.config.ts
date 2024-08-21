import { defineConfig } from 'drizzle-kit';
import { AUTH_PG_URL } from '@trg_package/express/models';

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
