import { FastifyInstance } from 'fastify';
import {
  createRing,
  getRingById,
  getUserRings,
  searchRings,
  getRingMemberCount,
} from '../services/ringService';
import { createMembership, isMember } from '../services/membershipService';
import { validateRingName, validateUUID } from '../utils/validation';
import { logError } from '../utils/logger';

interface CreateRingBody {
  name: string;
}

interface AddMemberBody {
  username: string;
}

export async function ringsRoutes(fastify: FastifyInstance) {
  // GET /api/rings
  fastify.get('/rings', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      const rings = await getUserRings(session.userId, search);
      
      return reply.send(rings);
    } catch (error: any) {
      logError(error, {
        method: 'GET',
        path: '/api/rings',
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to load rings. Please try again.',
        },
      });
    }
  });
  
  // POST /api/rings
  fastify.post<{ Body: CreateRingBody }>('/rings', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const { name } = request.body;
      
      const validation = validateRingName(name);
      if (!validation.valid) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error,
            field: 'name',
          },
        });
      }
      
      // Check if ring name exists
      const { getRingByName } = await import('../services/ringService');
      const existingRing = await getRingByName(name.trim());
      if (existingRing) {
        return reply.status(409).send({
          error: {
            code: 'RING_NAME_EXISTS',
            message: 'Ring name already exists. Please choose a different name.',
          },
        });
      }
      
      // Create ring
      const ring = await createRing(name.trim(), session.userId);
      
      // Auto-add creator as member
      await createMembership(session.userId, ring.id);
      
      const memberCount = await getRingMemberCount(ring.id);
      
      return reply.status(201).send({
        id: ring.id,
        name: ring.name,
        memberCount,
        createdAt: ring.createdAt.toISOString(),
      });
    } catch (error: any) {
      logError(error, {
        method: 'POST',
        path: '/api/rings',
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      if (error.code === '23505') { // Unique violation
        return reply.status(409).send({
          error: {
            code: 'RING_NAME_EXISTS',
            message: 'Ring name already exists. Please choose a different name.',
          },
        });
      }
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to create ring. Please try again.',
        },
      });
    }
  });
  
  // GET /api/rings/search
  fastify.get('/rings/search', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const q = (request.query as any)?.q;
      if (!q || typeof q !== 'string' || q.trim().length === 0) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please enter a search query.',
          },
        });
      }
      
      const rings = await searchRings(q.trim(), session.userId);
      
      return reply.send(rings);
    } catch (error: any) {
      logError(error, {
        method: 'GET',
        path: '/api/rings/search',
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to search rings. Please try again.',
        },
      });
    }
  });
  
  // POST /api/rings/:id/join
  fastify.post<{ Params: { id: string } }>('/rings/:id/join', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const { id } = request.params;
      
      if (!validateUUID(id)) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid ring ID format',
          },
        });
      }
      
      const ring = await getRingById(id);
      if (!ring) {
        return reply.status(404).send({
          error: {
            code: 'RING_NOT_FOUND',
            message: 'Ring not found',
          },
        });
      }
      
      // Check if already a member
      const member = await isMember(session.userId, id);
      if (member) {
        return reply.status(409).send({
          error: {
            code: 'ALREADY_MEMBER',
            message: 'You are already a member of this Ring.',
          },
        });
      }
      
      // Join ring
      await createMembership(session.userId, id);
      
      const memberCount = await getRingMemberCount(id);
      
      return reply.send({
        id: ring.id,
        name: ring.name,
        memberCount,
        isMember: true,
        createdAt: ring.createdAt.toISOString(),
      });
    } catch (error: any) {
      logError(error, {
        method: 'POST',
        path: `/api/rings/${request.params.id}/join`,
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      if (error.code === '23505') { // Unique violation
        return reply.status(409).send({
          error: {
            code: 'ALREADY_MEMBER',
            message: 'You are already a member of this Ring.',
          },
        });
      }
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to join Ring. Please try again.',
        },
      });
    }
  });
  
  // GET /api/rings/:id
  fastify.get<{ Params: { id: string } }>('/rings/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const { id } = request.params;
      
      if (!validateUUID(id)) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid ring ID format',
          },
        });
      }
      
      const ring = await getRingById(id);
      if (!ring) {
        return reply.status(404).send({
          error: {
            code: 'RING_NOT_FOUND',
            message: 'Ring not found',
          },
        });
      }
      
      // Check if user is a member
      const member = await isMember(session.userId, id);
      if (!member) {
        return reply.status(403).send({
          error: {
            code: 'FORBIDDEN',
            message: 'You are not a member of this Ring.',
          },
        });
      }
      
      const memberCount = await getRingMemberCount(id);
      
      return reply.send({
        id: ring.id,
        name: ring.name,
        memberCount,
        createdAt: ring.createdAt.toISOString(),
      });
    } catch (error: any) {
      logError(error, {
        method: 'GET',
        path: `/api/rings/${request.params.id}`,
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to load ring details. Please try again.',
        },
      });
    }
  });
  
  // GET /api/rings/:id/members
  fastify.get<{ Params: { id: string } }>('/rings/:id/members', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const { id } = request.params;
      
      if (!validateUUID(id)) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid ring ID format',
          },
        });
      }
      
      const ring = await getRingById(id);
      if (!ring) {
        return reply.status(404).send({
          error: {
            code: 'RING_NOT_FOUND',
            message: 'Ring not found',
          },
        });
      }
      
      // Check if user is a member
      const member = await isMember(session.userId, id);
      if (!member) {
        return reply.status(403).send({
          error: {
            code: 'FORBIDDEN',
            message: 'You are not a member of this Ring.',
          },
        });
      }
      
      const memberCount = await getRingMemberCount(id);
      
      return reply.send({
        memberCount,
      });
    } catch (error: any) {
      logError(error, {
        method: 'GET',
        path: `/api/rings/${request.params.id}/members`,
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to load member count. Please try again.',
        },
      });
    }
  });
  
  // POST /api/rings/:id/members
  fastify.post<{ Params: { id: string }; Body: AddMemberBody }>('/rings/:id/members', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const { id } = request.params;
      const { username } = request.body;
      
      if (!validateUUID(id)) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid ring ID format',
          },
        });
      }
      
      if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username is required',
            field: 'username',
          },
        });
      }
      
      const ring = await getRingById(id);
      if (!ring) {
        return reply.status(404).send({
          error: {
            code: 'RING_NOT_FOUND',
            message: 'Ring not found',
          },
        });
      }
      
      // Check if requester is a member
      const requesterIsMember = await isMember(session.userId, id);
      if (!requesterIsMember) {
        return reply.status(403).send({
          error: {
            code: 'FORBIDDEN',
            message: 'You are not a member of this Ring.',
          },
        });
      }
      
      // Find user by username
      const { getUserByUsername } = await import('../services/userService');
      const user = await getUserByUsername(username.trim());
      if (!user) {
        return reply.status(404).send({
          error: {
            code: 'USER_NOT_FOUND',
            message: `User '${username.trim()}' not found.`,
          },
        });
      }
      
      // Check if user is already a member
      const userIsMember = await isMember(user.id, id);
      if (userIsMember) {
        return reply.status(409).send({
          error: {
            code: 'ALREADY_MEMBER',
            message: `User '${username.trim()}' is already a member of this Ring.`,
          },
        });
      }
      
      // Add user to ring
      await createMembership(user.id, id);
      
      return reply.send({
        message: `User '${username.trim()}' has been added to the Ring.`,
        ringId: id,
        userId: user.id,
        username: user.username,
      });
    } catch (error: any) {
      logError(error, {
        method: 'POST',
        path: `/api/rings/${request.params.id}/members`,
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      if (error.code === '23505') { // Unique violation
        return reply.status(409).send({
          error: {
            code: 'ALREADY_MEMBER',
            message: `User '${request.body.username}' is already a member of this Ring.`,
          },
        });
      }
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to add user to ring. Please try again.',
        },
      });
    }
  });
}
