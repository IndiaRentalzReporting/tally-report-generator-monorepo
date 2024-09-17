import { createConfig } from '@trg_package/config-env';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import z from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'staging']),
  DOMAIN: z.string(),
  TLD: z.string(),

  SESSION_SECRET: z.string(),

  MONGO_USER: z.string(),
  MONGO_DATABASE: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_URL: z.string()
});

expand(config());

const env = createConfig(EnvSchema, process.env);

export default env;
