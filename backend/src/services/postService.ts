import { pool } from '../database/connection';
import { Post } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function createPost(
  ringId: string,
  userId: string,
  messageText: string,
  imageUrl: string | null = null
): Promise<Post> {
  const id = uuidv4();
  const createdAt = new Date();
  
  const result = await pool.query(
    'INSERT INTO posts (id, ring_id, user_id, message_text, image_url, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, ringId, userId, messageText, imageUrl, createdAt]
  );
  
  return {
    id: result.rows[0].id,
    ringId: result.rows[0].ring_id,
    userId: result.rows[0].user_id,
    messageText: result.rows[0].message_text,
    imageUrl: result.rows[0].image_url,
    createdAt: result.rows[0].created_at,
  };
}

export async function getRingPosts(ringId: string): Promise<any[]> {
  const result = await pool.query(
    `SELECT p.id, p.ring_id, p.user_id, p.message_text, p.image_url, p.created_at,
     u.username
     FROM posts p
     INNER JOIN users u ON p.user_id = u.id
     WHERE p.ring_id = $1
     ORDER BY p.created_at ASC`,
    [ringId]
  );
  
  return result.rows.map(row => ({
    id: row.id,
    ringId: row.ring_id,
    userId: row.user_id,
    username: row.username,
    messageText: row.message_text,
    imageUrl: row.image_url,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function getNewsFeedPosts(userId: string, search?: string): Promise<any[]> {
  let query = `
    SELECT p.id, p.ring_id, r.name as ring_name, p.user_id, u.username, p.message_text, p.image_url, p.created_at
    FROM posts p
    INNER JOIN rings r ON p.ring_id = r.id
    INNER JOIN users u ON p.user_id = u.id
    WHERE EXISTS (
      SELECT 1 FROM memberships m WHERE m.ring_id = p.ring_id AND m.user_id = $1
    )
  `;
  
  const params: any[] = [userId];
  
  if (search && search.trim()) {
    query += ` AND r.name ILIKE $2`;
    params.push(`%${search.trim()}%`);
  }
  
  query += ` ORDER BY p.created_at DESC`;
  
  const result = await pool.query(query, params);
  
  return result.rows.map(row => ({
    id: row.id,
    ringId: row.ring_id,
    ringName: row.ring_name,
    userId: row.user_id,
    username: row.username,
    messageText: row.message_text,
    imageUrl: row.image_url,
    createdAt: row.created_at.toISOString(),
  }));
}
