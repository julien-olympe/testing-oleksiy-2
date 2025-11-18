import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function setupRateLimiting(fastify: FastifyInstance) {
  // General rate limit: 100 requests per minute per user/IP
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
  });
  
  // Auth endpoints: 5 requests per minute per IP
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/api/auth/')) {
      await fastify.register(rateLimit, {
        max: 5,
        timeWindow: '1 minute',
        keyGenerator: (req) => req.ip,
        addHeaders: {
          'x-ratelimit-limit': true,
          'x-ratelimit-remaining': true,
          'x-ratelimit-reset': true,
        },
      });
    }
  });
}
