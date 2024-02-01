import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { knex } from '../lib/knex';
import { userAuth } from '../middlewares/userAuth';
import { createMealBodySchema } from '../validation/mealsSchema';

export const mealsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', userAuth);

  app.get('/', async (request) => {
    const userId = request.user.sub;

    const meals = await knex('meals').where({ user_id: userId }).select('*');

    return { meals };
  });

  app.post('/', async (request, reply) => {
    const userId = request.user.sub;
    const { name, description, is_diet } = createMealBodySchema.parse(request.body);

    const id = randomUUID();

    await knex('meals').insert({
      id,
      name,
      description,
      is_diet,
      date: new Date().toISOString(),
      user_id: userId,
    });

    return reply.status(201).send({ id });
  });
};
