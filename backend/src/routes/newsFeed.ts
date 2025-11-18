import { FastifyInstance } from 'fastify';
import { getNewsFeedPosts } from '../services/postService';
import { logError } from '../utils/logger';

export async function newsFeedRoutes(fastify: FastifyInstance) {
  // GET /api/news-feed
  fastify.get('/news-feed', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const session = request.session;
      if (!session || !session.userId) {
        return reply.status(401).send({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }
      
      const search = (request.query as any)?.search;
      const posts = await getNewsFeedPosts(session.userId, search);
      
      return reply.send(posts);
    } catch (error: any) {
      logError(error, {
        method: 'GET',
        path: '/api/news-feed',
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to load news feed. Please try again.',
        },
      });
    }
  });
}
