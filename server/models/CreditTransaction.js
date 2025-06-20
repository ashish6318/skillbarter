const mongoose = require('mongoose');

const creditTransactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
    // Transaction Details
  type: { 
    type: String, 
    enum: [
      'earned', 'spent', 'bonus', 'refund', 'penalty',
      'session_booking', 'session_cancellation', 'session_completion',
      'credit_purchase', 'credit_transfer'
    ],
    required: true 
  },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  
  // Reference
  relatedSession: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session' 
  },
  relatedUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
    // Description
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'teaching', 'learning', 'bonus', 'refund', 'admin',
      'session', 'purchase', 'transfer'
    ],
    required: true 
  },
  
  // Status
  status: { 
    type: String, 
    enum: ['completed', 'pending', 'failed', 'reversed'],
    default: 'completed' 
  },
  
  // Metadata
  metadata: {
    sessionDuration: Number,
    hourlyRate: Number,
    adminNote: String
  }

}, { timestamps: true });

// Indexes
creditTransactionSchema.index({ user: 1, createdAt: -1 });
creditTransactionSchema.index({ type: 1, status: 1 });
creditTransactionSchema.index({ relatedSession: 1 });

module.exports = mongoose.model('CreditTransaction', creditTransactionSchema);
