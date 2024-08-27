import { BadRequestError } from '@trg_package/errors';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

const stringBoolean = z.coerce
  .string()
  .transform((val) => {
    return val === 'true';
  })
  .default('false');

export const DashboardPgUrlKey = 'DASHBOARD_PG_URL';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'staging'])
    .default('development'),
  PORT: z.coerce.number().default(4000),

  [DashboardPgUrlKey]: z.string().optional(),

  SUPERUSER_PG_HOST: z.string(),
  SUPERUSER_PG_PORT: z.coerce.number(),
  SUPERUSER_PG_PASSWORD: z.string(),
  SUPERUSER_PG_USER: z.string(),
  SUPERUSER_PG_DATABASE: z.string(),
  SUPERUSER_PG_URL: z.string(),

  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean
});

expand(config());

const logError = (error: ZodError) => {
  let m = '';
  error.issues.forEach((issue) => {
    m += issue.path[0] + '\n';
  });
  return m;
};

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n';
    message += logError(error);
    const e = new BadRequestError(message);
    e.stack = '';
    throw e;
  } else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
