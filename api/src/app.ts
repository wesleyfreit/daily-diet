import fastify from 'fastify';

export const app = fastify();

app.get('/', async () => {
  return { info: 'hello world' };
});
