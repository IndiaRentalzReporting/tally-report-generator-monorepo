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

  PORT: z.coerce.number(),

  MAIL_FROM: z.string(),
  SMTP_SECRET: z.string(),
  SMTP_PASS: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),

  ENCRYPTION_KEY: z.string()
});

expand(config());

const env = createConfig(EnvSchema, process.env);

export default env;
