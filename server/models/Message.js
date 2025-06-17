const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Message Content
  content: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  messageType: { 
    type: String, 
    enum: ['text', 'session_request', 'session_accept', 'session_decline', 'system'],
    default: 'text' 
  },
  
  // Session Request Data
  sessionData: {
    skill: String,
    duration: Number, // in minutes
    proposedTime: Date,
    description: String,
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending' 
    }
  },
  
  // Message Status
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  // For message replies/threads
  replyTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  
  // Moderation
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

// Indexes for performance
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ receiver: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ 'sessionData.status': 1 });

// Compound index for conversation queries
messageSchema.index({ 
  sender: 1, 
  receiver: 1, 
  createdAt: -1 
});

module.exports = mongoose.model('Message', messageSchema);
