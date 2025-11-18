import { FastifyRequest, FastifyReply } from 'fastify';
import { SessionData } from '../types';

declare module 'fastify' {
  interface FastifyRequest {
    session?: SessionData;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const session = request.session;
  
  if (!session || !session.userId) {
    return reply.status(401).send({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }
}
