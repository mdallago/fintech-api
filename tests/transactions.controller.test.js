import { initDB, cleanDB } from '../src/db/init.js';
import {
  getTransactions,
  createTransaction,
  approveTransaction,
  rejectTransaction
} from '../src/controllers/transactions.controller.js';
import { jest } from '@jest/globals';
import { checkBalance } from './checkBalance.js';

beforeEach(async () => {
  await initDB(); 
});

afterEach(async () => {
  await cleanDB();
});

test('get transaction should be empty', async () => {
  const req = { query: { userId: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  await getTransactions(req, res);

  results = res.json.mock.calls[0][0];

  expect(results.data).toBeInstanceOf(Array);
  expect(results.data.length).toBe(0);
});

test('auto approve a transaction', async () => {
  const req = { query: { userId: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  await createTransaction({ body: { originUserId: 1, targetUserId: 2, amount: 100 } }, res);
  await getTransactions(req, res);

  results = res.json.mock.calls[1][0];
  expect(results.data).toBeInstanceOf(Array);
  expect(results.data.length).toBe(1);
  expect(results.data[0].id).toBe(1);
  expect(results.data[0].origin_user_id).toBe(1);
  expect(results.data[0].target_user_id).toBe(2);
  expect(results.data[0].amount).toBe("100.00");
  expect(results.data[0].state).toBe('approved');

  await checkBalance(1, 900.00);
  await checkBalance(2, 60100.00);
});

test('reject a transaction', async () => {
  const req = { query: { userId: 2 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  await createTransaction({ body: { originUserId: 2, targetUserId: 1, amount: 51000 } }, res);
  await rejectTransaction({ params: { id: 1 } }, res);
  await getTransactions(req, res);

  results = res.json.mock.calls[2][0];

  expect(results.data).toBeInstanceOf(Array);
  expect(results.data.length).toBe(1);
  expect(results.data[0].id).toBe(1);
  expect(results.data[0].origin_user_id).toBe(2);
  expect(results.data[0].target_user_id).toBe(1);
  expect(results.data[0].amount).toBe("51000.00");
  expect(results.data[0].state).toBe('rejected');

  await checkBalance(1, 1000.00);
  await checkBalance(2, 60000.00);
});

test('create two transactions, approve one', async () => {
  const req = { query: { userId: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  await createTransaction({ body: { originUserId: 1, targetUserId: 2, amount: 1000 } }, res);
  await createTransaction({ body: { originUserId: 1, targetUserId: 2, amount: 1000 } }, res);
  await getTransactions(req, res);

  results = res.json.mock.calls[2][0];

  expect(results.data).toBeInstanceOf(Array);
  expect(results.data.length).toBe(2);
  
  let pendingTx = results.data.find(tx => tx.state === 'pending');
  let approvedTx = results.data.find(tx => tx.state === 'approved');

  expect(pendingTx).toBeDefined();
  expect(approvedTx).toBeDefined();

  await checkBalance(1, 0.00);
  await checkBalance(2, 61000.00);
});

test('approve a transaction', async () => {
  const req = { query: { userId: 2 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  await createTransaction({ body: { originUserId: 2, targetUserId: 1, amount: 51000 } }, res);
  await approveTransaction({ params: { id: 1 } }, res);
  await getTransactions(req, res);

  results = res.json.mock.calls[2][0];

  expect(results.data).toBeInstanceOf(Array);
  expect(results.data.length).toBe(1);
  expect(results.data[0].id).toBe(1);
  expect(results.data[0].origin_user_id).toBe(2);
  expect(results.data[0].target_user_id).toBe(1);
  expect(results.data[0].amount).toBe("51000.00");
  expect(results.data[0].state).toBe('approved');

  await checkBalance(1, 52000.00);
  await checkBalance(2, 9000.00);
});