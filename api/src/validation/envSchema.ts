import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.string().transform(Number).default('3333'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['pg', 'sqlite']).default('pg'),
});
