import { config } from 'dotenv';
import { envSchema } from '../validation/envSchema';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  config({ path: '.env.dev' });
} else config();

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('⚠️  Invalid environment variables!', _env.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
