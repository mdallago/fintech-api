import { Router } from 'express';
import {
  getTransactions,
  createTransaction,
  approveTransaction,
  rejectTransaction
} from '../controllers/transactions.controller.js';

const router = Router();

router.post('/',   createTransaction);
router.get('/',    getTransactions);
router.patch('/:id/approve', approveTransaction);
router.patch('/:id/reject', rejectTransaction);

export default router;
