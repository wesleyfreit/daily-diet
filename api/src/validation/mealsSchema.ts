import z from 'zod';

export const createMealBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  is_diet: z.boolean(),
});
