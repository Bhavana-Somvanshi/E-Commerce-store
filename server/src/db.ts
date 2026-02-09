import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'staff';
  createdAt: string;
}

export interface RefreshToken {
  jti: string;
  userId: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface DbData {
  users: User[];
  refreshTokens: RefreshToken[];
}

const adapter = new JSONFile<DbData>('db.json');
export const db = new Low<DbData>(adapter, { users: [], refreshTokens: [] });

export async function initDb() {
  await db.read();
  db.data ||= { users: [], refreshTokens: [] };
  await db.write();
}
