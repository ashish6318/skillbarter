const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // Basic Info
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  
  // Profile
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  profilePicture: { type: String, default: '' },
  bio: { type: String, maxlength: 500 },
  
  // Location & Preferences
  timezone: { type: String, default: 'UTC' },
  languages: [{ type: String }],
  country: String,
  
  // Skills
  skillsOffered: [{
    skill: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Technology', 'Design', 'Business', 'Language', 'Music', 'Sports', 'Cooking', 'Other']
    },
    experience: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Expert'],
      default: 'Intermediate'
    },
    description: { type: String, maxlength: 200 },
    verified: { type: Boolean, default: false }
  }],
  
  skillsWanted: [{
    skill: { type: String, required: true },
    category: String,
    level: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Expert'],
      default: 'Beginner'
    },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    }
  }],
  
  // Credit System
  credits: { type: Number, default: 5 }, // Starting credits
  totalCreditsEarned: { type: Number, default: 0 },
  totalCreditsSpent: { type: Number, default: 0 },
  
  // Statistics
  totalHoursTaught: { type: Number, default: 0 },
  totalHoursLearned: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  
  // Availability
  availability: [{
    day: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    timeSlots: [{
      startTime: String, // "09:00"
      endTime: String    // "17:00"
    }]
  }],
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  
  // Moderation
  reportCount: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
  banReason: String,
  banExpiresAt: Date

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'skillsOffered.skill': 'text' });
userSchema.index({ 'skillsOffered.category': 1 });
userSchema.index({ 'skillsWanted.skill': 'text' });
userSchema.index({ rating: -1 });
userSchema.index({ lastSeen: -1 });
userSchema.index({ isActive: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate average rating
userSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.rating * this.totalReviews) + newRating;
  this.totalReviews += 1;
  this.rating = totalRating / this.totalReviews;
  await this.save();
};

// Method to get public profile (hide sensitive info)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  delete userObject.reportCount;
  delete userObject.isBanned;
  delete userObject.banReason;
  delete userObject.banExpiresAt;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
