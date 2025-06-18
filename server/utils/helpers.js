const jwt = require('jsonwebtoken');
const CreditTransaction = require('../models/CreditTransaction');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate secure room ID for video sessions
const generateRoomId = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `room_${timestamp}_${randomString}`;
};

// Credit transaction helper
const createCreditTransaction = async (userId, type, amount, description, metadata = {}) => {
  const User = require('../models/User');
  
  try {
    // Get current user balance
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Calculate new balance
    let newBalance;
    if (type === 'earned' || type === 'bonus' || type === 'refund') {
      newBalance = user.credits + amount;
    } else if (type === 'spent' || type === 'penalty') {
      if (user.credits < amount) {
        throw new Error('Insufficient credits');
      }
      newBalance = user.credits - amount;
    } else {
      throw new Error('Invalid transaction type');
    }
    
    // Create transaction record
    const transaction = new CreditTransaction({
      user: userId,
      type,
      amount,
      balanceAfter: newBalance,
      description,
      category: metadata.category || 'admin',
      relatedSession: metadata.sessionId,
      relatedUser: metadata.relatedUserId,
      metadata
    });
    
    await transaction.save();
    
    // Update user balance
    await User.findByIdAndUpdate(userId, { 
      credits: newBalance,
      ...(type === 'earned' && { totalCreditsEarned: user.totalCreditsEarned + amount }),
      ...(type === 'spent' && { totalCreditsSpent: user.totalCreditsSpent + amount })
    });
    
    return {
      success: true,
      transaction,
      newBalance
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Format error response
const formatError = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    ...(errors && { errors })
  };
};

// Format success response
const formatSuccess = (data, message = 'Success', pagination = null) => {
  return {
    success: true,
    message,
    data,
    ...(pagination && { pagination })
  };
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Calculate distance between two coordinates (for location-based features)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Generate Jitsi Meet URL
const generateJitsiUrl = (roomId, config = {}) => {
  const domain = process.env.JITSI_DOMAIN || 'meet.jit.si';
  const baseUrl = `https://${domain}/${roomId}`;
  
  // Add configuration parameters if needed
  const params = new URLSearchParams();
  if (config.displayName) params.append('displayName', config.displayName);
  if (config.startWithAudioMuted) params.append('startWithAudioMuted', 'true');
  if (config.startWithVideoMuted) params.append('startWithVideoMuted', 'true');
  
  return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

// Generate unique username suggestions
const generateUsernameSuggestions = (baseUsername) => {
  const suggestions = [];
  const timestamp = Date.now().toString().slice(-4);
  
  suggestions.push(`${baseUsername}${timestamp}`);
  suggestions.push(`${baseUsername}_${Math.floor(Math.random() * 1000)}`);
  suggestions.push(`${baseUsername}_${Math.random().toString(36).substring(2, 6)}`);
  
  return suggestions;
};

// Process credits (add or deduct) for user
const processCredits = async (userId, amount, type, description, sessionId = null) => {
  const User = require('../models/User');
  
  try {
    // Update user balance
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has enough credits for deduction
    if (amount < 0 && user.credits < Math.abs(amount)) {
      throw new Error('Insufficient credits');
    }

    const newBalance = user.credits + amount;
    
    // Update user balance
    user.credits = newBalance;
    await user.save();

    // Create transaction record
    const transaction = new CreditTransaction({
      user: userId,
      type,
      amount,
      balanceAfter: newBalance,
      description,
      category: 'session',
      relatedSession: sessionId,
      metadata: { sessionId }
    });

    await transaction.save();
    
    return { success: true, newBalance };
  } catch (error) {
    console.error('Error processing credits:', error);
    throw error;
  }
};

module.exports = {
  generateToken,
  generateRoomId,
  createCreditTransaction,
  processCredits,
  formatError,
  formatSuccess,
  isValidObjectId,
  calculateDistance,
  generateJitsiUrl,
  sanitizeInput,
  generateUsernameSuggestions
};
