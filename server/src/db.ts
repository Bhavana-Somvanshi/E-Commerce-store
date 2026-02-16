import pg from 'pg';

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kimi_admin';

export const pool = new Pool({ connectionString });

export async function query<T = unknown>(text: string, params?: unknown[]) {
  const result = await pool.query<T>(text, params);
  return result;
}

export async function ensureConnection() {
  const client = await pool.connect();
  client.release();
}

 