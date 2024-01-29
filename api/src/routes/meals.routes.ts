import { FastifyInstance } from 'fastify';
import { knex } from '../lib/knex';

export const mealsRoutes = async (app: FastifyInstance) => {
  app.get('/', async () => {
    const meals = await knex('meals').select('*');

    return { meals };
  });
};
