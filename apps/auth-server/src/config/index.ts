import { createConfig } from '@trg_package/config-env';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

const stringBoolean = z.coerce
  .string()
  .transform((val) => val === 'true')
  .default('false');

export const DashboardPgUrlKey = 'DASHBOARD_PG_URL';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'staging'])
    .default('development'),
  PORT: z.coerce.number(),

  AUTH_SUBDOMAIN: z.string().default('auth'),
  DASH_SUBDOMAIN: z.string().default('dashboard'),

  DOMAIN: z.string().default('trg'),
  TLD: z.string().default('local'),

  [DashboardPgUrlKey]: z.string().optional(),

  SUPERUSER_PG_HOST: z.string(),
  SUPERUSER_PG_PORT: z.coerce.number(),
  SUPERUSER_PG_PASSWORD: z.string(),
  SUPERUSER_PG_USER: z.string(),
  SUPERUSER_PG_DATABASE: z.string(),
  SUPERUSER_PG_URL: z.string(),

  AUTH_PG_HOST: z.string(),
  AUTH_PG_PORT: z.coerce.number(),
  AUTH_PG_PASSWORD: z.string(),
  AUTH_PG_USER: z.string(),
  AUTH_PG_DATABASE: z.string(),
  AUTH_PG_URL: z.string(),

  DASHBOARD_PG_HOST: z.string().optional(),
  DASHBOARD_PG_PORT: z.coerce.number().optional(),
  DASHBOARD_PG_PASSWORD: z.string().optional(),
  DASHBOARD_PG_USER: z.string().optional(),
  DASHBOARD_PG_DATABASE: z.string().optional(),

  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean
});

expand(config());

const env = createConfig(EnvSchema, process.env);

export default env;
