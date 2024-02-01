import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { knex } from '../lib/knex';
import { userAuth } from '../middlewares/userAuth';
import { userCheck } from '../middlewares/userCheck';
import { createMealBodySchema, updateMealBodySchema } from '../validation/mealsSchema';
import { getParamsSchema } from '../validation/paramsSchema';

export const mealsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', userAuth);

  app.addHook('preHandler', userCheck);

  app.get('/', async (request, reply) => {
    const userId = request.user.sub;

    const meals = await knex('meals')
      .where({ user_id: userId })
      .select('id', 'name', 'is_diet', 'date');

    return reply.send({ meals });
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

  app.get('/:id', async (request, reply) => {
    const userId = request.user.sub;

    const { id } = getParamsSchema.parse(request.params);

    const meal = await knex('meals').where({ id, user_id: userId }).first();

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' });
    }

    return reply.send({ meal });
  });

  app.put('/:id', async (request, reply) => {
    const userId = request.user.sub;

    const { id } = getParamsSchema.parse(request.params);

    const meal = await knex('meals').where({ id, user_id: userId }).first();

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' });
    }

    const data = updateMealBodySchema.parse(request.body);

    await knex('meals')
      .where({ id })
      .update({ ...data });

    return reply.status(204).send();
  });
};
