import { query } from '../src/db/pool.js';

export async function checkBalance(userId, balance) {
  const { rows } = await query('SELECT balance FROM users WHERE id = $1', [userId]);

  if (!rows.length) {
    throw new Error('User not found');
  }

  const userBalance = Number(rows[0].balance);

  if (userBalance !== balance) {
    throw new Error(`Balance mismatch: expected ${balance}, got ${userBalance}`);
  }
}