import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import session from '@fastify/session';
import { join } from 'path';
import { authRoutes } from './routes/auth';
import { newsFeedRoutes } from './routes/newsFeed';
import { ringsRoutes } from './routes/rings';
import { postsRoutes } from './routes/posts';
import { healthRoutes } from './routes/health';
import { requireAuth } from './middleware/auth';

const fastify = Fastify({
  logger: true,
});

// Register plugins
async function build() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });
  
  // Cookie
  await fastify.register(cookie, {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    parseOptions: {},
  });
  
  // Session
  await fastify.register(session, {
    cookieName: 'sessionId',
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    },
  });
  
  // Multipart for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
  
  // Rate limiting
  await fastify.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
  });
  
  // Authentication middleware
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    await requireAuth(request, reply);
  });
  
  // Serve static files for uploads
  await fastify.register(require('@fastify/static'), {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
    decorateReply: false,
  });
  
  // Register routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(newsFeedRoutes, { prefix: '/api' });
  await fastify.register(ringsRoutes, { prefix: '/api' });
  await fastify.register(postsRoutes, { prefix: '/api' });
  await fastify.register(healthRoutes, { prefix: '/api' });
  
  return fastify;
}

const start = async () => {
  try {
    const app = await build();
    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
