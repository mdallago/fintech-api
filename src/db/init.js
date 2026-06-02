import { query } from './pool.js';

export async function initDB() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name        VARCHAR(255) NOT NULL,
      balance     NUMERIC(10, 2) NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      origin_user_id  INTEGER      NOT NULL REFERENCES users(id),
      target_user_id  INTEGER      NOT NULL REFERENCES users(id),
      amount      NUMERIC(10, 2) NOT NULL,
      state       VARCHAR(50)  NOT NULL DEFAULT 'pending',
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    INSERT INTO users (name, balance)
    VALUES ('John', 1000.00)
  `);

  await query(`
    INSERT INTO users (name, balance)
    VALUES ('Doe', 60000.00)
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_transactions_origin_user_id_created_at ON transactions (origin_user_id, created_at);
  `);

  console.log('✅  Database tables ready');
}

export async function cleanDB() {
  await query(`
    DROP TABLE IF EXISTS transactions;  
    DROP TABLE IF EXISTS users;
  `);

  console.log('✅  Database tables deleted');
}
