import pg from 'pg';
import type { QueryResultRow } from 'pg';

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_2PU6DjJXdrky@ep-shiny-heart-aiy49f35-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({ connectionString });

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) {
  const result = await pool.query<T>(text, params);
  return result;
}


export async function ensureConnection() {
  const client = await pool.connect();
  client.release();
}
