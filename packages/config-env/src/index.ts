import { z } from 'zod';

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function createConfig<T extends z.ZodObject<any>>(
  schema: T,
  env: Record<string, unknown>
): z.infer<T> & { PROTOCOL: 'https' | 'http' } {
  try {
    let parsedEnv = schema.parse(env);
    return {
      ...parsedEnv,
      PROTOCOL: parsedEnv.NODE_ENV === 'production' ? 'https' : 'http'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      let message = 'Invalid environment configuration:\n';
      error.issues.forEach((issue) => {
        message += `${issue.path.join('.')}: ${issue.message}\n`;
      });
      throw new ConfigError(message);
    } else {
      throw error;
    }
  }
}
