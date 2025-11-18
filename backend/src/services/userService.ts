import { pool } from '../database/connection';
import { User } from '../types';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10;

export async function createUser(username: string, password: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = uuidv4();
  const createdAt = new Date();
  
  const result = await pool.query(
    'INSERT INTO users (id, username, password_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, username, passwordHash, createdAt]
  );
  
  return {
    id: result.rows[0].id,
    username: result.rows[0].username,
    passwordHash: result.rows[0].password_hash,
    createdAt: result.rows[0].created_at,
    lastLoginAt: result.rows[0].last_login_at,
  };
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function updateLastLogin(userId: string): Promise<void> {
  await pool.query('UPDATE users SET last_login_at = $1 WHERE id = $2', [new Date(), userId]);
}
