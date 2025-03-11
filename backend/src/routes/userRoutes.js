const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
      min: 6,
    }),
  ],
  registerUser
);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

module.exports = router; 