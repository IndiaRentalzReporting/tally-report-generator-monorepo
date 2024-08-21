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

  PG_HOST: z.string(),
  PG_PORT: z.coerce.number(),
  PG_PASSWORD: z.string(),
  PG_USER: z.string(),
  PG_DATABASE: z.string(),
  PG_URL: z.string(),

  SUPER_USER_NAME: z.string(),
  DEVELOPER_FIRST_NAME: z.string(),
  DEVELOPER_LAST_NAME: z.string(),
  DEVELOPER_EMAIL: z.string(),
  DEVELOPER_PASSWORD: z.string(),

  MAIL_FROM: z.string(),
  SMTP_SECRET: z.string(),
  SMTP_PASS: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),

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
    console.error(error);
    let message = 'Missing required values in .env:\n';
    message += logError(error);
    const e = new Error(message);
    e.stack = '';
    throw e;
  } else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
