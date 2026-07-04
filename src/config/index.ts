import dotenv from 'dotenv';
import { envSchema, type Env } from '../shared/validators/index';

dotenv.config();

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    throw new Error(`Error de validación de variables de entorno:\n${errors.join('\n')}`);
  }

  return result.data;
}

export const config = loadEnv();
