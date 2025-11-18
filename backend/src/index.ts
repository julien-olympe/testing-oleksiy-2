import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import session from '@fastify/session';
import rateLimit from '@fastify/rate-limit';
import staticFiles from '@fastify/static';
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
  
  // Authentication middleware
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    await requireAuth(request, reply);
  });
  
  // Serve static files for uploads
  await fastify.register(staticFiles, {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
    decorateReply: false,
  });
  
  // Rate limiting configuration per endpoint type
  // Register multiple rate limit plugins with skip functions to apply different limits
  
  // 1. Authentication endpoints: 5 requests per minute per IP address
  await fastify.register(rateLimit, {
    max: 5,
    timeWindow: '1 minute',
    keyGenerator: (req) => req.ip,
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    skip: (req) => {
      // Only apply to auth register/login endpoints
      return !(req.url.startsWith('/api/auth/register') || req.url.startsWith('/api/auth/login'));
    },
  });
  
  // 2. Post creation endpoints: 10 requests per minute per user
  await fastify.register(rateLimit, {
    max: 10,
    timeWindow: '1 minute',
    keyGenerator: (req) => {
      const session = (req as any).session;
      return session?.userId ? `user:${session.userId}` : req.ip;
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    skip: (req) => {
      // Only apply to POST /api/rings/:id/posts
      return !(req.method === 'POST' && req.url.match(/^\/api\/rings\/[^/]+\/posts$/));
    },
  });
  
  // 3. Search endpoints: 20 requests per minute per user
  await fastify.register(rateLimit, {
    max: 20,
    timeWindow: '1 minute',
    keyGenerator: (req) => {
      const session = (req as any).session;
      return session?.userId ? `user:${session.userId}` : req.ip;
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    skip: (req) => {
      // Only apply to search endpoints
      const isSearch = req.url.includes('/search') || 
                      (req.url === '/api/news-feed' && (req.query as any)?.search) ||
                      (req.url === '/api/rings' && (req.query as any)?.search);
      return !isSearch;
    },
  });
  
  // 4. General API endpoints: 100 requests per minute per user
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (req) => {
      const session = (req as any).session;
      return session?.userId ? `user:${session.userId}` : req.ip;
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    skip: (req) => {
      // Skip endpoints that have specific rate limits
      if (req.url.startsWith('/api/auth/register') || req.url.startsWith('/api/auth/login')) {
        return true; // Handled by auth rate limit
      }
      if (req.method === 'POST' && req.url.match(/^\/api\/rings\/[^/]+\/posts$/)) {
        return true; // Handled by post creation rate limit
      }
      const isSearch = req.url.includes('/search') || 
                      (req.url === '/api/news-feed' && (req.query as any)?.search) ||
                      (req.url === '/api/rings' && (req.query as any)?.search);
      if (isSearch) {
        return true; // Handled by search rate limit
      }
      return false; // Apply to all other endpoints
    },
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
