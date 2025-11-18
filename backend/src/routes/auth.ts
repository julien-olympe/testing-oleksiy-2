import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createUser, getUserByUsername, verifyPassword, updateLastLogin } from '../services/userService';
import { validateUsername, validatePassword } from '../utils/validation';
import { logError } from '../utils/logger';
import { createMembership } from '../services/membershipService';
import { createRing } from '../services/ringService';

interface RegisterBody {
  username: string;
  password: string;
}

interface LoginBody {
  username: string;
  password: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/register
  fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    try {
      const { username, password } = request.body;
      
      // Validate username
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: usernameValidation.error,
            field: 'username',
          },
        });
      }
      
      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: passwordValidation.error,
            field: 'password',
          },
        });
      }
      
      // Check if username exists
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return reply.status(409).send({
          error: {
            code: 'USERNAME_EXISTS',
            message: 'Username already exists',
          },
        });
      }
      
      // Create user
      const user = await createUser(username, password);
      
      // Auto-login: set session
      request.session = {
        userId: user.id,
        username: user.username,
      };
      
      return reply.status(201).send({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
      });
    } catch (error: any) {
      logError(error, {
        method: 'POST',
        path: '/api/auth/register',
        requestId: request.id,
      });
      
      if (error.code === '23505') { // Unique violation
        return reply.status(409).send({
          error: {
            code: 'USERNAME_EXISTS',
            message: 'Username already exists',
          },
        });
      }
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during registration. Please try again.',
        },
      });
    }
  });
  
  // POST /api/auth/login
  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    try {
      const { username, password } = request.body;
      
      if (!username || !password) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username and password are required',
          },
        });
      }
      
      const user = await getUserByUsername(username);
      if (!user) {
        return reply.status(401).send({
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid username or password',
          },
        });
      }
      
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return reply.status(401).send({
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid username or password',
          },
        });
      }
      
      // Update last login
      await updateLastLogin(user.id);
      
      // Set session
      request.session = {
        userId: user.id,
        username: user.username,
      };
      
      return reply.send({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
    } catch (error: any) {
      logError(error, {
        method: 'POST',
        path: '/api/auth/login',
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during login. Please try again.',
        },
      });
    }
  });
  
  // POST /api/auth/logout
  fastify.post('/logout', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      request.session = null;
      return reply.send({
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      logError(error, {
        method: 'POST',
        path: '/api/auth/logout',
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during logout. Please try again.',
        },
      });
    }
  });
  
  // GET /api/auth/me
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const { getUserById } = await import('../services/userService');
      const user = await getUserById(session.userId);
      
      if (!user) {
        return reply.status(401).send({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }
      
      return reply.send({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
      });
    } catch (error: any) {
      logError(error, {
        method: 'GET',
        path: '/api/auth/me',
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to load settings. Please try again.',
        },
      });
    }
  });
}
