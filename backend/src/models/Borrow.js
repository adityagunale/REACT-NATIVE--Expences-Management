const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowerName: {
    type: String,
    required: [true, 'Please add borrower name']
  },
  amount: {
    type: Number,
    required: [true, 'Please add amount']
  },
  purpose: {
    type: String,
    required: [true, 'Please add purpose']
  },
  date: {
    type: Date,
    required: [true, 'Please add date']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add due date']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  interestRate: {
    type: Number,
    default: 0
  },
  paymentHistory: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Borrow', BorrowSchema); 