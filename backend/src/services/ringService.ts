import { pool } from '../database/connection';
import { Ring } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function createRing(name: string, creatorId: string): Promise<Ring> {
  const id = uuidv4();
  const createdAt = new Date();
  
  const result = await pool.query(
    'INSERT INTO rings (id, name, creator_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, name, creatorId, createdAt]
  );
  
  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    creatorId: result.rows[0].creator_id,
    createdAt: result.rows[0].created_at,
  };
}

export async function getRingById(id: string): Promise<Ring | null> {
  const result = await pool.query('SELECT * FROM rings WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    creatorId: row.creator_id,
    createdAt: row.created_at,
  };
}

export async function getRingByName(name: string): Promise<Ring | null> {
  const result = await pool.query('SELECT * FROM rings WHERE name = $1', [name]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    creatorId: row.creator_id,
    createdAt: row.created_at,
  };
}

export async function getUserRings(userId: string, search?: string): Promise<any[]> {
  let query = `
    SELECT r.id, r.name, r.created_at, COUNT(m.id) as member_count
    FROM rings r
    INNER JOIN memberships m ON r.id = m.ring_id
    WHERE EXISTS (
      SELECT 1 FROM memberships m2 WHERE m2.ring_id = r.id AND m2.user_id = $1
    )
  `;
  
  const params: any[] = [userId];
  
  if (search && search.trim()) {
    query += ` AND r.name ILIKE $2`;
    params.push(`%${search.trim()}%`);
  }
  
  query += ` GROUP BY r.id, r.name, r.created_at ORDER BY r.created_at DESC`;
  
  const result = await pool.query(query, params);
  
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    memberCount: parseInt(row.member_count, 10),
    createdAt: row.created_at.toISOString(),
  }));
}

export async function searchRings(query: string, userId: string): Promise<any[]> {
  const result = await pool.query(
    `SELECT r.id, r.name, r.created_at,
     COUNT(DISTINCT m.id) as member_count,
     EXISTS(SELECT 1 FROM memberships m2 WHERE m2.ring_id = r.id AND m2.user_id = $2) as is_member
     FROM rings r
     LEFT JOIN memberships m ON r.id = m.ring_id
     WHERE r.name ILIKE $1
     GROUP BY r.id, r.name, r.created_at
     ORDER BY r.created_at DESC`,
    [`%${query}%`, userId]
  );
  
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    memberCount: parseInt(row.member_count, 10),
    isMember: row.is_member,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function getRingMemberCount(ringId: string): Promise<number> {
  const result = await pool.query('SELECT COUNT(*) as count FROM memberships WHERE ring_id = $1', [ringId]);
  return parseInt(result.rows[0].count, 10);
}
