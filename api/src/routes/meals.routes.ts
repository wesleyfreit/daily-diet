import { FastifyInstance } from 'fastify';
import { knex } from '../lib/knex';
import { userAuth } from '../middlewares/userAuth';

export const mealsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', userAuth);

  app.get('/', async (request) => {
    const userId = request.user.sub;

    const meals = await knex('meals').where({ user_id: userId }).select('*');

    return { meals };
  });
};
