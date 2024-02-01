import z from 'zod';

export const createMealBodySchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  description: z.string({ required_error: 'Description is required' }),
  is_diet: z.boolean({ required_error: 'Is diet required' }),
});
