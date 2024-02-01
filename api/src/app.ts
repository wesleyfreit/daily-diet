import jwt from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { mealsRoutes } from './routes/meals.routes';
import { usersRoutes } from './routes/users.routes';

export const app = fastify();

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(jwt, { secret: env.JWT_SECRET });

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    const errorObject = error.errors.reduce((acc: { [key: string]: string }, err) => {
      const path = err.path[0];
      acc[path] = err.message;
      return acc;
    }, {});

    reply.status(400).send({ error: errorObject });
  } else {
    reply.status(500).send({ error: 'Internal server error' });
  }
});

app.register(usersRoutes);
app.register(mealsRoutes, { prefix: 'meals' });
