const Borrow = require('../models/Borrow');

// @desc    Get all borrows for a user
// @route   GET /api/borrows
// @access  Private
exports.getBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user.id });
    res.json({
      success: true,
      data: borrows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single borrow
// @route   GET /api/borrows/:id
// @access  Private
exports.getBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Make sure user owns borrow record
    if (borrow.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: borrow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new borrow
// @route   POST /api/borrows
// @access  Private
exports.createBorrow = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const borrow = await Borrow.create(req.body);

    res.status(201).json({
      success: true,
      data: borrow
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update borrow
// @route   PUT /api/borrows/:id
// @access  Private
exports.updateBorrow = async (req, res) => {
  try {
    let borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Make sure user owns borrow record
    if (borrow.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    borrow = await Borrow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: borrow
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete borrow
// @route   DELETE /api/borrows/:id
// @access  Private
exports.deleteBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Make sure user owns borrow record
    if (borrow.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await borrow.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add payment to borrow
// @route   POST /api/borrows/:id/payments
// @access  Private
exports.addPayment = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Make sure user owns borrow record
    if (borrow.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { amount, note } = req.body;

    // Add payment to history
    borrow.paymentHistory.push({
      amount,
      note
    });

    // Calculate total paid amount
    const totalPaid = borrow.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);

    // Update status if fully paid
    if (totalPaid >= borrow.amount) {
      borrow.status = 'paid';
    }

    await borrow.save();

    res.json({
      success: true,
      data: borrow
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark borrow as overdue
// @route   PUT /api/borrows/:id/mark-overdue
// @access  Private
exports.markOverdue = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Make sure user owns borrow record
    if (borrow.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    borrow.status = 'overdue';
    await borrow.save();

    res.json({
      success: true,
      data: borrow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 