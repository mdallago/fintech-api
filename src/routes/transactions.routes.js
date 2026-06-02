import { Router } from 'express';
import {
  getTransactions,
  createTransaction,
  approveTransaction,
  rejectTransaction
} from '../controllers/transactions.controller.js';

const router = Router();


/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     parameters:
 *     - in: body
 *       name: transaction
 *       description: Transaction object that needs to be added
 *       required: true
 *       example:
 *         originUserId: 1
 *         targetUserId: 2
 *         amount: 100.50
 *       content:
 *         application/json:
 *           schema:
 *              type: object  
 *              required:
 *                - originUserId
 *                - targetUserId
 *                - amount
 *              properties:
 *               origin_user_id:
 *                 type: integer
 *                 example: 1
 *               target_user_id:
 *                 type: integer
 *                 example: 2
 *               amount:
 *                 type: number
 *                 example: 100.50
 *     responses:
 *       200:
*         description: Created transaction
*         content:
 *           application/json:
 *              schema:
 *                 properties:
 *                   data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         origin_user_id:
 *                           type: integer
 *                           example: 1
 *                         target_user_id:
 *                           type: integer
 *                           example: 2
 *                         amount:
 *                           type: number
 *                           example: 100.50
 *                         state:
 *                           type: string
 *                           example: pending
 */
router.post('/',   createTransaction);


/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Retrieve a list of transactions
 *     parameters:
 *      - in: query
 *        name: userId
 *        schema:
 *         type: integer
 *         required: true
 *         description: User Id
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *              schema:
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         origin_user_id:
 *                           type: integer
 *                           example: 1
 *                         target_user_id:
 *                           type: integer
 *                           example: 2
 *                         amount:
 *                           type: number
 *                           example: 100.50
 *                         state:
 *                           type: string
 *                           example: pending
 *                   count:
 *                     type: integer
 *                     example: 10
 */
router.get('/', getTransactions);




/**
 * @swagger
 * /transactions/{id}/approve:
 *   patch:
 *     summary: Approve a transaction
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: integer
 *         required: true
 *         description: Transaction Id
 *     responses:
 *       200:
 *         description: transaction object
 *         content:
 *           application/json:
 *              schema:
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         origin_user_id:
 *                           type: integer
 *                           example: 1
 *                         target_user_id:
 *                           type: integer
 *                           example: 2
 *                         amount:
 *                           type: number
 *                           example: 100.50
 *                         state:
 *                           type: string
 *                           example: pending
 *                   count:
 *                     type: integer
 *                     example: 10
 */
router.patch('/:id/approve', approveTransaction);


/**
 * @swagger
 * /transactions/{id}/reject:
 *   patch:
 *     summary: Reject a transaction
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: integer
 *         required: true
 *         description: Transaction Id
 *     responses:
 *       200:
 *         description: transaction object
 *         content:
 *           application/json:
 *              schema:
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         origin_user_id:
 *                           type: integer
 *                           example: 1
 *                         target_user_id:
 *                           type: integer
 *                           example: 2
 *                         amount:
 *                           type: number
 *                           example: 100.50
 *                         state:
 *                           type: string
 *                           example: pending
 *                   count:
 *                     type: integer
 *                     example: 10
 */
router.patch('/:id/reject', rejectTransaction);

export default router;
