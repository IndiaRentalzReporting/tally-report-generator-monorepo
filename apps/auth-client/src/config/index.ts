import { BadRequestError } from '@trg_package/errors';
import { ZodError, z } from 'zod';

const EnvSchema = z.object({
  VITE_NODE_ENV: z.enum(['production', 'development', 'staging']),
  VITE_PORT: z.coerce.number(),
  VITE_DOMAIN: z.string(),
  VITE_TLD: z.string(),
  VITE_AUTH_SUBDOMAIN: z.string(),
  VITE_DASH_SUBDOMAIN: z.string()
});

const logError = (error: ZodError) => {
  let m = '';
  error.issues.forEach((issue) => {
    m += issue.path[0] + '\n';
  });
  return m;
};

try {
  EnvSchema.parse(import.meta.env);
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

const env = EnvSchema.parse(import.meta.env);
let finalEnv: z.infer<typeof EnvSchema> & {
  PROTOCOL: string;
} = {
  ...env,
  PROTOCOL: env.VITE_NODE_ENV === 'production' ? 'https' : 'http'
};

export default finalEnv;
