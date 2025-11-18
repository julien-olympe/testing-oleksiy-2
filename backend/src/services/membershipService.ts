import { pool } from '../database/connection';
import { Membership } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function createMembership(userId: string, ringId: string): Promise<Membership> {
  const id = uuidv4();
  const joinedAt = new Date();
  
  const result = await pool.query(
    'INSERT INTO memberships (id, user_id, ring_id, joined_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, userId, ringId, joinedAt]
  );
  
  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    ringId: result.rows[0].ring_id,
    joinedAt: result.rows[0].joined_at,
  };
}

export async function getMembership(userId: string, ringId: string): Promise<Membership | null> {
  const result = await pool.query(
    'SELECT * FROM memberships WHERE user_id = $1 AND ring_id = $2',
    [userId, ringId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    ringId: row.ring_id,
    joinedAt: row.joined_at,
  };
}

export async function isMember(userId: string, ringId: string): Promise<boolean> {
  const membership = await getMembership(userId, ringId);
  return membership !== null;
}
