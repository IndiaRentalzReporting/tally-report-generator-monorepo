import { BadRequestError } from '@trg_package/errors';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

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
  SMTP_USER: z.string()
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

const env = EnvSchema.parse(process.env);
let finalEnv: z.infer<typeof EnvSchema> & {
  PROTOCOL: string;
} = {
  ...env,
  PROTOCOL: env.NODE_ENV === 'production' ? 'https' : 'http'
};

export default finalEnv;
