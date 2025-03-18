const express = require('express');
const router = express.Router();
const { sendExpenseReport } = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

// Send expense report email
router.post('/send-report', protect, sendExpenseReport);

module.exports = router; 