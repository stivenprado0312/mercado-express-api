import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info')
});

export type Env = z.infer<typeof envSchema>;
