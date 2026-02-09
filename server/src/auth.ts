import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { db, type User, type RefreshToken } from './db.js';

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;

const jwtSecret = process.env.JWT_SECRET || 'dev_access_secret';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export function getUserByEmail(email: string) {
  return db.data?.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string) {
  return db.data?.users.find((u) => u.id === id);
}

export async function ensureAdminUser(email: string, password: string) {
  const existing = getUserByEmail(email);
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: `user_${nanoid(10)}`,
    email,
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  db.data?.users.push(user);
  await db.write();
  return user;
}

export async function validatePassword(user: User, password: string) {
  return bcrypt.compare(password, user.passwordHash);
}

export function signAccessToken(user: User) {
  return jwt.sign(
    { sub: user.id, role: user.role, type: 'access' },
    jwtSecret,
    { expiresIn: ACCESS_TTL_SECONDS }
  );
}

export async function signRefreshToken(user: User) {
  const jti = nanoid(16);
  const token = jwt.sign(
    { sub: user.id, type: 'refresh', jti },
    jwtRefreshSecret,
    { expiresIn: REFRESH_TTL_SECONDS }
  );
  const refreshRecord: RefreshToken = {
    jti,
    userId: user.id,
    expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000).toISOString(),
  };
  db.data?.refreshTokens.push(refreshRecord);
  await db.write();
  return token;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, jwtSecret) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, jwtRefreshSecret) as jwt.JwtPayload;
}

export function getRefreshRecord(jti: string) {
  return db.data?.refreshTokens.find((t) => t.jti === jti);
}

export async function revokeRefreshToken(jti: string) {
  const record = getRefreshRecord(jti);
  if (!record) return;
  record.revokedAt = new Date().toISOString();
  await db.write();
}
