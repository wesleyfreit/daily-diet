import { FastifyInstance } from 'fastify';
import { knex } from '../lib/knex';

export const usersRoutes = async (app: FastifyInstance) => {
  app.get('/', async () => {
    const users = await knex('users').select('*');

    return { users };
  });
};
