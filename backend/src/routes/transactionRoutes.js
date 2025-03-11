const express = require('express');
const { check } = require('express-validator');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', getTransactions);

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', getTransaction);

// @route   POST /api/transactions
// @desc    Create a transaction
// @access  Private
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('type', 'Type is required and must be either income or expense').isIn([
      'income',
      'expense',
    ]),
    check('category', 'Category is required').not().isEmpty(),
  ],
  createTransaction
);

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put(
  '/:id',
  [
    check('title', 'Title is required if provided').optional().not().isEmpty(),
    check('amount', 'Amount must be a number if provided').optional().isNumeric(),
    check('type', 'Type must be either income or expense if provided')
      .optional()
      .isIn(['income', 'expense']),
    check('category', 'Category is required if provided').optional().not().isEmpty(),
  ],
  updateTransaction
);

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', deleteTransaction);

module.exports = router; 