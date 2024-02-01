import { FastifyReply, FastifyRequest } from 'fastify';
import { knex } from '../lib/knex';

export const userCheck = async (request: FastifyRequest, reply: FastifyReply) => {
  const userId = request.user.sub;
  const user = await knex('users').where({ id: userId }).first();

  if (!user) {
    return reply.status(401).send({ error: 'Not authorized' });
  }
};
