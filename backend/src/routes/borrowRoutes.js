const express = require('express');
const {
  getBorrows,
  getBorrow,
  createBorrow,
  updateBorrow,
  deleteBorrow,
  addPayment,
  markOverdue
} = require('../controllers/borrowController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router
  .route('/')
  .get(getBorrows)
  .post(createBorrow);

router
  .route('/:id')
  .get(getBorrow)
  .put(updateBorrow)
  .delete(deleteBorrow);

router.post('/:id/payments', addPayment);
router.put('/:id/mark-overdue', markOverdue);

module.exports = router; 