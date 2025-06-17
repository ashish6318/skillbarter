// Credit transaction types
const CREDIT_TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  TRANSFER: 'transfer', 
  EARNED: 'earned',
  SPENT: 'spent',
  REFUND: 'refund'
};

// Credit transaction status
const CREDIT_TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Session status
const SESSION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

// User roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Message types
const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
};

// Skill categories
const SKILL_CATEGORIES = [
  'Technology',
  'Languages',
  'Arts & Crafts',
  'Music',
  'Sports & Fitness',
  'Cooking',
  'Business',
  'Academic',
  'Personal Development',
  'Other'
];

module.exports = {
  CREDIT_TRANSACTION_TYPES,
  CREDIT_TRANSACTION_STATUS,
  SESSION_STATUS,
  USER_ROLES,
  MESSAGE_TYPES,
  SKILL_CATEGORIES
};
