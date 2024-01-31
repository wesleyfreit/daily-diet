import { FastifyReply, FastifyRequest } from 'fastify';

export const userAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = error.message as string;
      switch (message) {
        case 'Authorization token expired':
          return reply.status(401).send({ error: 'Invalid session' });
        default:
          return reply.status(401).send({ error: 'Not authorized' });
      }
    }
  }
};
