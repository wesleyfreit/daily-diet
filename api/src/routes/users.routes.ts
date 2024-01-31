import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { knex } from '../lib/knex';
import { createUserBodySchema, loginUserBodySchema } from '../validation/usersSchema';

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/signup', async (request, reply) => {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const userByEmail = await knex('users').where({ email }).first();

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();

    await knex('users').insert({
      id,
      name,
      email,
      password: hash,
    });

    const token = app.jwt.sign({}, { expiresIn: '1h', sub: id });

    return reply.status(201).send({ user_id: id, token });
  });

  app.post('/signin', async (request, reply) => {
    const { email, password } = loginUserBodySchema.parse(request.body);

    const userByEmail = await knex('users').where({ email }).first();

    if (userByEmail) {
      const isValidPassword = await bcrypt.compare(password, userByEmail.password);

      if (isValidPassword) {
        const token = app.jwt.sign({}, { expiresIn: '1h', sub: userByEmail.id });

        return reply.status(200).send({ user_id: userByEmail.id, token });
      }
      return reply.status(401).send({ message: 'Invalid password' });
    }
    return reply.status(401).send({ message: 'User does not exist' });
  });
};
