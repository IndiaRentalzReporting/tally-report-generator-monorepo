import z from 'zod';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { createConfig } from '@trg_package/config-env';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'staging']),

  AUTH_SUBDOMAIN: z.string(),
  DASH_SUBDOMAIN: z.string(),

  DOMAIN: z.string(),
  TLD: z.string(),

  AUTH_PG_URL: z.string(),

  DASHBOARD_PG_HOST: z.string(),
  DASHBOARD_PG_PORT: z.coerce.number(),

  PORT: z.coerce.number(),

  ENCRYPTION_KEY: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
});

expand(config());

const env = createConfig(EnvSchema, process.env);

export default env;
