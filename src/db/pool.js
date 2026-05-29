import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'appdb',
  user:     process.env.DB_USER     || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(1);
});

/** Run a single query */
export const query = (text, params) => pool.query(text, params);

/**
 * Get a client for multi-statement transactions.
 * Always call client.release() in a finally block.
 */
export const getClient = () => pool.connect();

export default pool;
