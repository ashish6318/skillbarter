// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  DISCOVER: {
    USERS: '/discover',
    SEARCH: '/discover/search',
    CATEGORIES: '/discover/categories',
    TRENDING: '/discover/trending',
  },
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    SEND: '/messages/send',
  },
  SESSIONS: {
    LIST: '/sessions',
    CREATE: '/sessions/create',
  },
};

// Socket events
export const SOCKET_EVENTS = {
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // Messaging
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_READ: 'message:read',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  
  // Conversations
  JOIN_CONVERSATION: 'join:conversation',
  LEAVE_CONVERSATION: 'leave:conversation',
  
  // Sessions
  SESSION_REQUEST: 'session:request',
  SESSION_ACCEPTED: 'session:accepted',
  SESSION_STARTED: 'session:started',
  SESSION_ENDED: 'session:ended',
  SESSION_REMINDER: 'session:reminder',
  
  // User status
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  
  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  
  // Errors
  ERROR: 'error',
};

// Skill categories
export const SKILL_CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Language',
  'Music',
  'Sports',
  'Cooking',
  'Other',
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Expert',
];

// Priority levels
export const PRIORITY_LEVELS = [
  'Low',
  'Medium',
  'High',
];

// Session statuses
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  ABANDONED: 'abandoned',
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  SESSION_REQUEST: 'session_request',
  SESSION_ACCEPT: 'session_accept',
  SESSION_DECLINE: 'session_decline',
  SYSTEM: 'system',
};

// Days of the week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Common time slots
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00'
];

// Session durations (in minutes)
export const SESSION_DURATIONS = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
];

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// App routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DISCOVER: '/discover',
  MESSAGES: '/messages',
  SESSIONS: '/sessions',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SKILL_ADDED: 'Skill added successfully!',
  MESSAGE_SENT: 'Message sent!',
  SESSION_CREATED: 'Session created successfully!',
  SESSION_CANCELLED: 'Session cancelled.',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DISCOVER_LIMIT: 12,
  MESSAGES_LIMIT: 50,
  SESSIONS_LIMIT: 10,
  TRANSACTIONS_LIMIT: 20,
};

// Rating system
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
};

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};
