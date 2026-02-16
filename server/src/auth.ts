import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { query } from './db.js';

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;

const jwtSecret = process.env.JWT_SECRET || 'dev_access_secret';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export type UserType = 'admin' | 'customer';
export type AdminRole = 'admin' | 'manager' | 'staff';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  type: UserType;
  role: AdminRole | null;
  name: string | null;
}

export async function getUserByEmail(email: string) {
  const res = await query<UserRow>(
    `SELECT id, email, password_hash, type, role, name
     FROM users WHERE lower(email) = lower($1)`,
    [email]
  );
  return res.rows[0] ?? null;
}

export async function getUserById(id: string) {
  const res = await query<UserRow>(
    `SELECT id, email, password_hash, type, role, name
     FROM users WHERE id = $1`,
    [id]
  );
  return res.rows[0] ?? null;
}

export async function ensureAdminUser(email: string, password: string, role: AdminRole) {
  const existing = await getUserByEmail(email);
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(password, 10);
  const res = await query<UserRow>(
    `INSERT INTO users (email, password_hash, type, role)
     VALUES ($1, $2, 'admin', $3)
     RETURNING id, email, password_hash, type, role, name`,
    [email, passwordHash, role]
  );
  return res.rows[0];
}

export async function createCustomer(email: string, password: string, name: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const res = await query<UserRow>(
    `INSERT INTO users (email, password_hash, type, name)
     VALUES ($1, $2, 'customer', $3)
     RETURNING id, email, password_hash, type, role, name`,
    [email, passwordHash, name]
  );
  return res.rows[0];
}

export async function validatePassword(user: UserRow, password: string) {
  return bcrypt.compare(password, user.password_hash);
}

export function signAccessToken(user: UserRow) {
  return jwt.sign(
    { sub: user.id, type: user.type, role: user.role ?? undefined },
    jwtSecret,
    { expiresIn: ACCESS_TTL_SECONDS }
  );
}

export async function signRefreshToken(user: UserRow) {
  const jti = nanoid(16);
  const token = jwt.sign(
    { sub: user.id, type: user.type, jti },
    jwtRefreshSecret,
    { expiresIn: REFRESH_TTL_SECONDS }
  );
  await query(
    `INSERT INTO refresh_tokens (jti, user_id, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
    [jti, user.id]
  );
  return token;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, jwtSecret) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, jwtRefreshSecret) as jwt.JwtPayload;
}

export async function getRefreshRecord(jti: string) {
  const res = await query<{ jti: string; revoked_at: string | null }>(
    `SELECT jti, revoked_at FROM refresh_tokens WHERE jti = $1`,
    [jti]
  );
  return res.rows[0] ?? null;
}

export async function revokeRefreshToken(jti: string) {
  await query(`UPDATE refresh_tokens SET revoked_at = NOW() WHERE jti = $1`, [jti]);
}
