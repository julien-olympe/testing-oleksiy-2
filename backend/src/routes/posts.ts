import { FastifyInstance } from 'fastify';
import { getRingPosts, createPost } from '../services/postService';
import { getRingById } from '../services/ringService';
import { isMember } from '../services/membershipService';
import { validateUUID, validateMessageText, validateImageFile } from '../utils/validation';
import { logError } from '../utils/logger';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface CreatePostBody {
  messageText: string;
}

export async function postsRoutes(fastify: FastifyInstance) {
  // GET /api/rings/:id/posts
  fastify.get<{ Params: { id: string } }>('/rings/:id/posts', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      const posts = await getRingPosts(id);
      
      return reply.send(posts);
    } catch (error: any) {
      logError(error, {
        method: 'GET',
        path: `/api/rings/${request.params.id}/posts`,
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to load posts. Please try again.',
        },
      });
    }
  });
  
  // POST /api/rings/:id/posts
  fastify.post<{ Params: { id: string } }>('/rings/:id/posts', { preHandler: [fastify.authenticate] }, async (request, reply) => {
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
      
      // Handle multipart form data
      let messageText = '';
      let imageFile: any = null;
      
      const parts = request.parts();
      
      for await (const part of parts) {
        if (part.type === 'file') {
          imageFile = part;
        } else {
          if (part.fieldname === 'messageText') {
            messageText = part.value.toString();
          }
        }
      }
      
      // Validate message text
      const messageValidation = validateMessageText(messageText);
      if (!messageValidation.valid) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: messageValidation.error,
            field: 'messageText',
          },
        });
      }
      
      let imageUrl: string | null = null;
      
      // Handle image upload if present
      if (imageFile && imageFile.filename) {
        const buffer = await imageFile.toBuffer();
        const fileSize = buffer.length;
        
        const validation = validateImageFile(
          imageFile.mimetype,
          imageFile.filename,
          fileSize
        );
        
        if (!validation.valid) {
          return reply.status(400).send({
            error: {
              code: 'VALIDATION_ERROR',
              message: validation.error,
              field: 'image',
            },
          });
        }
        
        // Ensure uploads directory exists
        const uploadsDir = join(process.cwd(), 'uploads', 'images');
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }
        
        // Generate unique filename
        const ext = imageFile.filename.substring(imageFile.filename.lastIndexOf('.'));
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
        const filepath = join(uploadsDir, filename);
        
        // Save file
        await writeFile(filepath, buffer);
        
        imageUrl = `/uploads/images/${filename}`;
      }
      
      // Create post
      const post = await createPost(id, session.userId, messageText.trim(), imageUrl);
      
      // Get username for response
      const { getUserById } = await import('../services/userService');
      const user = await getUserById(session.userId);
      
      return reply.status(201).send({
        id: post.id,
        ringId: post.ringId,
        userId: post.userId,
        username: user?.username || session.username,
        messageText: post.messageText,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt.toISOString(),
      });
    } catch (error: any) {
      logError(error, {
        method: 'POST',
        path: `/api/rings/${request.params.id}/posts`,
        userId: request.session?.userId,
        requestId: request.id,
      });
      
      return reply.status(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to create post. Please try again.',
        },
      });
    }
  });
}
