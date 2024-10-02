import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/dashboard/schema',
  out: './src/models/dashboard/migrations',
  dbCredentials: {
    url: 'postgresql://hargun_singh_15b36f8f:F5pQcfXEX7PP1Tf40mEzDFhpT8QVDKcY@localhost:5432/hargun_singh_6d2cb951'
  },
  strict: true,
  verbose: true
});
