import { FastifyInstance } from 'fastify';
import { testConnection } from '../database/connection';

export async function healthRoutes(fastify: FastifyInstance) {
  // GET /api/health
  fastify.get('/health', async (request, reply) => {
    try {
      const dbConnected = await testConnection();
      const status = dbConnected ? 'healthy' : 'unhealthy';
      const dbStatus = dbConnected ? 'connected' : 'disconnected';
      
      const response = {
        status,
        timestamp: new Date().toISOString(),
        database: dbStatus,
      };
      
      if (status === 'unhealthy') {
        return reply.status(503).send(response);
      }
      
      return reply.send(response);
    } catch (error) {
      return reply.status(503).send({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      });
    }
  });
}
