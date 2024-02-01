import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';

import { knex } from '../lib/knex';
import { userAuth } from '../middlewares/userAuth';
import { createUserBodySchema, loginUserBodySchema } from '../validation/usersSchema';

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/signup', async (request, reply) => {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const userByEmail = await knex('users').where({ email }).first();

    if (userByEmail) {
      return reply.status(400).send({ error: 'User already exists' });
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

        return reply.send({ user_id: userByEmail.id, token });
      }
      return reply.status(401).send({ error: 'Invalid password' });
    }
    return reply.status(404).send({ error: 'User does not exist' });
  });

  app.get('/users/metrics', { preHandler: [userAuth] }, async (request, reply) => {
    const userId = request.user.sub;

    const totalMeals = await knex('meals')
      .where({ user_id: userId })
      .select('*')
      .orderBy('date', 'desc');

    const totalMealsOnDiet = totalMeals.filter((meal) => meal.is_diet).length;

    const totalMealsOffDiet = totalMeals.length - totalMealsOnDiet;

    const { bestOnDietSequence } = totalMeals.reduce(
      (acc, meal) => {
        meal.is_diet ? (acc.currentSequence += 1) : (acc.currentSequence = 0);

        if (acc.currentSequence > acc.bestOnDietSequence) {
          acc.bestOnDietSequence = acc.currentSequence;
        }

        return acc;
      },
      { bestOnDietSequence: 0, currentSequence: 0 },
    );

    return reply.send({
      totalMeans: totalMeals.length,
      totalMealsOnDiet: totalMealsOnDiet,
      totalMealsOffDiet: totalMealsOffDiet,
      bestOnDietSequence,
    });
  });
};
