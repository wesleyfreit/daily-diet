import jwt from '@fastify/jwt';
import fastify from 'fastify';

import { env } from './env';
import { mealsRoutes } from './routes/meals.routes';
import { usersRoutes } from './routes/users.routes';

export const app = fastify();

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(jwt, { secret: env.JWT_SECRET });

app.register(usersRoutes);
app.register(mealsRoutes, { prefix: 'meals' });
