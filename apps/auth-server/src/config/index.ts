import { createConfig } from '@trg_package/config-env';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

export const DASHBOARD_PG_URL = 'DASHBOARD_PG_URL';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'staging'])
    .default('development'),
  PORT: z.coerce.number(),

  AUTH_SUBDOMAIN: z.string().default('auth'),
  DASH_SUBDOMAIN: z.string().default('dashboard'),

  DOMAIN: z.string().default('trg'),
  TLD: z.string().default('local'),

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
  [DASHBOARD_PG_URL]: z.string().optional(),

  MAIL_FROM: z.string(),
  SMTP_SECRET: z.string(),
  SMTP_USER: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PASS: z.string(),
  SMTP_PORT: z.coerce.number(),
});

expand(config({ path: `.env.${process.env.NODE_ENV}` }));

const env = createConfig(EnvSchema, process.env);

export default env;
