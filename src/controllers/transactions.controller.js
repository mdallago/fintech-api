import { query, getClient } from '../db/pool.js';

export async function getTransactions(req, res) {
  const { userId } = req.query;

  let text = 'SELECT * FROM transactions'; //TODO specify the columns explicitly
  const values = [];
  
  if (userId) {
    values.push(userId);
    text += ' WHERE origin_user_id = $1';
  }

  text += ' ORDER BY created_at DESC';

  const { rows } = await query(text, values);
  res.json({ data: rows, count: rows.length });
}

export async function createTransaction(req, res) {
  const { originUserId, targetUserId, amount } = req.body;

  if (!originUserId || !targetUserId || !amount) {
    return res.status(400).json({ error: '`originUserId`, `targetUserId`, and `amount` are required' });
  }

  //TODO validate users exist and amount is positive
  //TODO validate origin user has sufficient balance
  
  const { rows } = await query(
    `INSERT INTO transactions (origin_user_id, target_user_id, amount, state)
     VALUES ($1, $2, $3, 'pending')
     RETURNING *`,
    [originUserId, targetUserId, amount]
  );


  //TODO Auto approve

  res.status(201).json({ data: rows[0] });
}

export async function rejectTransaction(req, res) {
  const { id } = req.params;
  
  const { rows } = await query(
    `UPDATE transactions
     SET state = 'rejected'
     WHERE id = $1
     AND state = 'pending'
     RETURNING *`,
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json({ data: rows[0] });
}
     
export async function approveTransaction(req, res) {
  const { id } = req.params;
  
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const { rows: transactionsRows } = await client.query(
      'SELECT * FROM transactions WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (!transactionsRows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactionsRows[0];

    if (transaction.state !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Transaction is not pending' });
    }

    const { rows: userRows } = await client.query(
      'SELECT * FROM users WHERE id = $1 FOR UPDATE',
      [transaction.origin_user_id]
    );

    if (!userRows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const originUser = userRows[0];

    if (originUser.balance < transaction.amount) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'Insufficient balance',
        available: originUser.balance,
      });
    }

    const { rows: destinationUserRows } = await client.query(
      'SELECT * FROM users WHERE id = $1 FOR UPDATE',
      [transaction.target_user_id]
    );

    if (!destinationUserRows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const destinationUser = destinationUserRows[0];

    await client.query(
      'UPDATE users SET balance = balance - $1, WHERE id = $2',
      [transaction.amount, transaction.origin_user_id]
    );

    await client.query(
      'UPDATE users SET balance = balance + $1, WHERE id = $2',
      [transaction.amount, transaction.target_user_id]
    );

    await client.query(
      "UPDATE transactions SET state = 'approved' WHERE id = $1",
      [id]
    );

    await client.query('COMMIT');

    res.json({ data: transactionsRows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
