const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this transaction',
      });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, amount, type, category, date, description } = req.body;

  try {
    const newTransaction = new Transaction({
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      description,
      user: req.user.id,
    });

    const transaction = await newTransaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, amount, type, category, date, description } = req.body;

  // Build transaction object
  const transactionFields = {};
  if (title) transactionFields.title = title;
  if (amount) transactionFields.amount = amount;
  if (type) transactionFields.type = type;
  if (category) transactionFields.category = category;
  if (date) transactionFields.date = date;
  if (description) transactionFields.description = description;

  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this transaction',
      });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );

    res.json(transaction);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this transaction',
      });
    }

    await transaction.deleteOne();

    res.json({ success: true, message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
}; 