const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Session Details
  skill: { type: String, required: true },
  category: String,
  description: String,
  
  // Scheduling
  scheduledTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // planned duration in minutes
  actualDuration: { type: Number, default: 0 }, // actual time spent
  
  // Session Status
  status: { 
    type: String, 
    enum: [
      'scheduled',    // Confirmed and waiting
      'in_progress',  // Currently happening
      'completed',    // Successfully finished
      'cancelled',    // Cancelled before start
      'no_show',      // Student didn't show up
      'abandoned'     // Started but not completed
    ],
    default: 'scheduled' 
  },
  
  // Video Call Details
  roomId: { type: String, unique: true },
  roomPassword: String,
  meetingUrl: String,
  
  // Timing
  startedAt: Date,
  endedAt: Date,
  
  // Credit Management
  creditsExchanged: { type: Number, default: 0 },
  creditTransactionId: String,
  
  // Session Notes
  teacherNotes: String,
  studentNotes: String,
  sessionSummary: String,
  
  // Review System
  review: {
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String, maxlength: 500 },
    reviewedAt: Date,
    wouldRecommend: Boolean
  },
  
  // Moderation
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reportReason: String,
  isDisputed: { type: Boolean, default: false },
  
  // Reminder System
  remindersSent: [{
    type: { type: String, enum: ['24h', '1h', '15min'] },
    sentAt: Date
  }]

}, { timestamps: true });

// Indexes for performance
sessionSchema.index({ teacher: 1, status: 1 });
sessionSchema.index({ student: 1, status: 1 });
sessionSchema.index({ scheduledTime: 1 });
sessionSchema.index({ status: 1, scheduledTime: 1 });
sessionSchema.index({ roomId: 1 });

// Compound indexes
sessionSchema.index({ 
  teacher: 1, 
  student: 1, 
  scheduledTime: 1 
});

// Generate unique room ID before saving
sessionSchema.pre('save', function(next) {
  if (!this.roomId) {
    this.roomId = `room_${this._id}_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
