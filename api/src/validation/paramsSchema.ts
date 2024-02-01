import z from 'zod';

export const getParamsSchema = z.object({
  id: z.string().uuid(),
});
