# 🎯 Skill Barter Platform - Complete Technical Specification

**Project**: Peer-to-Peer Skill Exchange Platform  
**Created**: 2025-06-17 08:18:14 UTC  
**Author**: ashish6318  
**Version**: 1.0  

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [Technical Architecture](#technical-architecture)
3. [Rate Limiting Implementation](#rate-limiting-implementation)
4. [Pagination System](#pagination-system)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Real-time Features](#real-time-features)
9. [Security & Authentication](#security--authentication)
10. [Deployment Strategy](#deployment-strategy)

---

## 🎪 Platform Overview

### Core Concept
A **1-to-1 skill exchange platform** where users teach and learn from each other using a credit-based economy. No money involved - pure skill bartering system.

### Value Proposition
- **Teach 1 hour** → Earn 1 credit
- **Learn 1 hour** → Spend 1 credit
- **Fair Exchange**: Everyone contributes and benefits equally
- **Global Access**: No financial barriers, works anywhere

### Key Features
- **Discover Page**: Browse all users with skills they offer
- **Real-time Messaging**: Direct chat with skill providers
- **Video Sessions**: Integrated Jitsi Meet for 1-to-1 learning
- **Credit System**: Automatic credit management
- **Rating System**: Build trust through peer reviews
- **Session Scheduling**: Calendar-based appointment system

---

## 🏗️ Technical Architecture

### Tech Stack

#### Frontend
```
Framework: React.js 18+ with Vite
Styling: Tailwind CSS 3.0
State Management: React Context + useReducer
HTTP Client: Axios
Real-time: Socket.IO Client
Video: Jitsi Meet API
Date/Time: date-fns
Routing: React Router v6
Forms: React Hook Form + Yup validation
```

#### Backend
```
Runtime: Node.js 18+
Framework: Express.js 4.18+
Database: MongoDB 6.0 with Mongoose ODM
Authentication: JWT + bcrypt
Real-time: Socket.IO Server
File Upload: Multer
Validation: Joi
Logging: Winston
Process Management: PM2
Environment: dotenv
```

#### DevOps & Hosting
```
Frontend: Vercel (Free Tier)
Backend: Railway (Free Tier) 
Database: MongoDB Atlas (Free 512MB)
CI/CD: GitHub Actions
Domain: Namecheap or Cloudflare
SSL: Let's Encrypt (Free)
Monitoring: UptimeRobot (Free)
```

---

## ⚡ Rate Limiting Implementation

### Purpose
Prevent abuse, ensure fair usage, and maintain system stability across all endpoints.

### Rate Limiting Strategy

#### 1. Global Rate Limiting
```javascript
// Middleware: globalRateLimit.js
const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max 1000 requests per 15 minutes per IP
  message: {
    error: 'Too many requests from this IP',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime)
    });
  }
});

module.exports = globalLimiter;
```

#### 2. Authentication Rate Limiting
```javascript
// Stricter limits for login/register endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes'
  }
});

// Usage:
app.post('/api/auth/login', authLimiter, loginController);
app.post('/api/auth/register', authLimiter, registerController);
```

#### 3. Messaging Rate Limiting
```javascript
// Prevent message spam
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Max 10 messages per minute
  message: {
    error: 'Message rate limit exceeded',
    retryAfter: '1 minute'
  }
});

app.post('/api/messages/send', messageLimiter, sendMessageController);
```

#### 4. API Discovery Rate Limiting
```javascript
// Discover page - prevent scraping
const discoverLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Max 50 discover requests per 5 minutes
  message: {
    error: 'Discover rate limit exceeded',
    retryAfter: '5 minutes'
  }
});

app.get('/api/discover', discoverLimiter, discoverController);
```

#### 5. Session Creation Rate Limiting
```javascript
// Prevent session spam
const sessionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 session requests per hour
  message: {
    error: 'Session creation limit exceeded',
    retryAfter: '1 hour'
  }
});

app.post('/api/sessions/create', sessionLimiter, createSessionController);
```

### Rate Limiting by User ID
```javascript
// Custom rate limiter based on authenticated user
const userBasedLimiter = (maxRequests, windowMs) => {
  const store = new Map();
  
  return (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!store.has(userId)) {
      store.set(userId, []);
    }
    
    const userRequests = store.get(userId);
    // Remove old requests outside window
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'User rate limit exceeded',
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }
    
    validRequests.push(now);
    store.set(userId, validRequests);
    next();
  };
};
```

---

## 📄 Pagination System

### Purpose
Handle large datasets efficiently, improve performance, and provide smooth user experience.

### Pagination Strategy

#### 1. Cursor-Based Pagination (Recommended)
```javascript
// More efficient for real-time data and large datasets
const paginateWithCursor = async (model, query = {}, options = {}) => {
  const {
    limit = 20,
    cursor = null,
    sortField = 'createdAt',
    sortOrder = -1,
    populate = ''
  } = options;
  
  // Build query
  let dbQuery = { ...query };
  
  if (cursor) {
    if (sortOrder === -1) {
      dbQuery[sortField] = { $lt: cursor };
    } else {
      dbQuery[sortField] = { $gt: cursor };
    }
  }
  
  // Execute query
  const documents = await model
    .find(dbQuery)
    .sort({ [sortField]: sortOrder })
    .limit(limit + 1) // Get one extra to check if there's more
    .populate(populate);
  
  const hasMore = documents.length > limit;
  const results = hasMore ? documents.slice(0, -1) : documents;
  
  const nextCursor = hasMore ? 
    results[results.length - 1][sortField] : null;
  
  return {
    success: true,
    data: results,
    pagination: {
      hasMore,
      nextCursor,
      limit,
      count: results.length
    }
  };
};
```

#### 2. Offset-Based Pagination (For Simple Cases)
```javascript
const paginateWithOffset = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sortField = 'createdAt',
    sortOrder = -1,
    populate = ''
  } = options;
  
  const skip = (page - 1) * limit;
  
  const [documents, totalCount] = await Promise.all([
    model
      .find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(populate),
    model.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    success: true,
    data: documents,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasMore: page < totalPages,
      hasPrevious: page > 1,
      limit
    }
  };
};
```

### Pagination Implementation by Feature

#### 1. Discover Page Pagination
```javascript
// Controller: discoverController.js
const getDiscoverUsers = async (req, res) => {
  try {
    const {
      cursor,
      limit = 12,
      skill,
      category,
      language,
      minRating
    } = req.query;
    
    // Build filter query
    let query = { 
      _id: { $ne: req.user.id }, // Exclude current user
      isActive: true,
      'skillsOffered.0': { $exists: true } // Has at least one skill
    };
    
    if (skill) {
      query['skillsOffered.skill'] = new RegExp(skill, 'i');
    }
    
    if (category) {
      query['skillsOffered.category'] = category;
    }
    
    if (language) {
      query.languages = { $in: [language] };
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    const result = await paginateWithCursor(User, query, {
      cursor: cursor ? new Date(cursor) : null,
      limit: parseInt(limit),
      sortField: 'lastSeen',
      sortOrder: -1,
      populate: 'skillsOffered skillsWanted'
    });
    
    res.json(result);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};
```

#### 2. Messages List Pagination
```javascript
// Controller: messagesController.js
const getConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    
    // Aggregate to get latest message per conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      { $unwind: '$otherUser' },
      { $sort: { 'lastMessage.createdAt': -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);
    
    res.json({
      success: true,
      data: conversations,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
        hasMore: conversations.length === parseInt(limit)
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};
```

#### 3. Chat Messages Pagination
```javascript
const getChatMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const { cursor, limit = 50 } = req.query;
    const userId = req.user.id;
    
    const query = {
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    };
    
    const result = await paginateWithCursor(Message, query, {
      cursor: cursor ? new Date(cursor) : null,
      limit: parseInt(limit),
      sortField: 'createdAt',
      sortOrder: -1, // Latest first
      populate: 'sender receiver'
    });
    
    // Reverse order for chat display (oldest first)
    result.data.reverse();
    
    res.json(result);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};
```

#### 4. Session History Pagination
```javascript
const getSessionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const userId = req.user.id;
    
    let query = {
      $or: [{ teacher: userId }, { student: userId }],
      status: 'completed'
    };
    
    // Filter by type: taught or learned
    if (type === 'taught') {
      query = { teacher: userId, status: 'completed' };
    } else if (type === 'learned') {
      query = { student: userId, status: 'completed' };
    }
    
    const result = await paginateWithOffset(Session, query, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortField: 'endedAt',
      sortOrder: -1,
      populate: 'teacher student'
    });
    
    res.json(result);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session history',
      error: error.message
    });
  }
};
```

### Frontend Pagination Components

#### 1. Infinite Scroll Component
```jsx
// components/common/InfiniteScroll.jsx
import React, { useState, useEffect, useCallback } from 'react';

const InfiniteScroll = ({ 
  fetchData, 
  renderItem, 
  loadingComponent,
  emptyComponent,
  errorComponent,
  hasMore: initialHasMore = true 
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState(null);
  const [error, setError] = useState(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchData({ cursor });
      const { data, pagination } = response;
      
      setItems(prev => cursor ? [...prev, ...data] : data);
      setHasMore(pagination.hasMore);
      setCursor(pagination.nextCursor);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchData, cursor, loading, hasMore]);

  // Initial load
  useEffect(() => {
    loadMore();
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  if (error && items.length === 0) {
    return errorComponent ? errorComponent(error) : <div>Error: {error}</div>;
  }

  if (items.length === 0 && !loading) {
    return emptyComponent ? emptyComponent() : <div>No items found</div>;
  }

  return (
    <div>
      {items.map((item, index) => renderItem(item, index))}
      
      {loading && (loadingComponent ? loadingComponent() : (
        <div className="text-center py-4">Loading...</div>
      ))}
      
      {hasMore && <div id="scroll-sentinel" className="h-1" />}
      
      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more items to load
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
```

#### 2. Traditional Pagination Component
```jsx
// components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showingFrom,
  showingTo,
  totalCount
}) => {
  const generatePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{showingFrom}</span> to{' '}
            <span className="font-medium">{showingTo}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {generatePages().map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
```

---

## 🗄️ Database Schema

### User Model
```javascript
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
userSchema.index({ 'skillsOffered.skill': 'text', 'skillsOffered.category': 1 });
userSchema.index({ 'skillsWanted.skill': 'text' });
userSchema.index({ rating: -1 });
userSchema.index({ lastSeen: -1 });
userSchema.index({ isActive: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to calculate average rating
userSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.rating * this.totalReviews) + newRating;
  this.totalReviews += 1;
  this.rating = totalRating / this.totalReviews;
  await this.save();
};
```

### Message Model
```javascript
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
```

### Session Model
```javascript
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
```

### Credit Transaction Model
```javascript
const creditTransactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Transaction Details
  type: { 
    type: String, 
    enum: ['earned', 'spent', 'bonus', 'refund', 'penalty'],
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
    enum: ['teaching', 'learning', 'bonus', 'refund', 'admin'],
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
```

---

## 🚀 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/forgot-password   - Send password reset email
POST   /api/auth/reset-password    - Reset password with token
POST   /api/auth/verify-email      - Verify email address
```

### User Management Endpoints
```
GET    /api/users/profile          - Get current user profile
PUT    /api/users/profile          - Update current user profile
GET    /api/users/:id              - Get user by ID (public info)
PUT    /api/users/skills/offered   - Update skills offered
PUT    /api/users/skills/wanted    - Update skills wanted
PUT    /api/users/availability     - Update availability schedule
POST   /api/users/upload-avatar    - Upload profile picture
```

### Discovery Endpoints
```
GET    /api/discover               - Get paginated list of users with skills
GET    /api/discover/search        - Search users by skill/category
GET    /api/discover/categories    - Get all skill categories
GET    /api/discover/trending      - Get trending skills
GET    /api/discover/:id           - Get detailed user profile for discovery
```

### Messaging Endpoints
```
GET    /api/messages/conversations - Get user's conversations (paginated)
GET    /api/messages/:userId       - Get messages with specific user (paginated)
POST   /api/messages/send          - Send message to user
PUT    /api/messages/:id/read      - Mark message as read
DELETE /api/messages/:id           - Delete message
POST   /api/messages/session-request - Send session request message
```

### Session Management Endpoints
```
GET    /api/sessions               - Get user's sessions (paginated)
POST   /api/sessions/create        - Create new session
PUT    /api/sessions/:id           - Update session details
DELETE /api/sessions/:id           - Cancel session
POST   /api/sessions/:id/start     - Start session (generate room)
POST   /api/sessions/:id/end       - End session and process credits
POST   /api/sessions/:id/review    - Submit session review
GET    /api/sessions/:id/room      - Get video room details
```

### Credit System Endpoints
```
GET    /api/credits/balance        - Get current credit balance
GET    /api/credits/transactions   - Get credit transaction history (paginated)
POST   /api/credits/transfer       - Manual credit transfer (admin)
GET    /api/credits/stats          - Get credit statistics
```

### Real-time WebSocket Events
```
connection                        - User connects to socket
disconnect                        - User disconnects

// Messaging
message:send                      - Send real-time message
message:received                  - Message received by other user
message:read                      - Message marked as read
typing:start                      - User started typing
typing:stop                       - User stopped typing

// Sessions
session:request                   - New session request
session:accepted                  - Session request accepted
session:started                   - Session has started
session:ended                     - Session has ended
session:reminder                  - Session reminder

// General
user:online                       - User came online
user:offline                      - User went offline
notification:new                  - New notification for user
```

---

## 🎨 Frontend Components

### Component Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Layout.jsx
│   │   ├── InfiniteScroll.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchBar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── Dashboard/
│   │   ├── DashboardHome.jsx
│   │   ├── CreditBalance.jsx
│   │   ├── UpcomingSessions.jsx
│   │   ├── RecentActivity.jsx
│   │   └── QuickStats.jsx
│   ├── Discover/
│   │   ├── DiscoverPage.jsx
│   │   ├── UserCard.jsx
│   │   ├── SkillFilter.jsx
│   │   ├── CategoryFilter.jsx
│   │   └── UserDetailModal.jsx
│   ├── Messages/
│   │   ├── ConversationsList.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── MessageInput.jsx
│   │   ├── MessageBubble.jsx
│   │   └── SessionRequestCard.jsx
│   ├── Sessions/
│   │   ├── SessionsList.jsx
│   │   ├── SessionCard.jsx
│   │   ├── VideoCall.jsx
│   │   ├── SessionTimer.jsx
│   │   ├── ScheduleSession.jsx
│   │   └── SessionReview.jsx
│   ├── Profile/
│   │   ├── UserProfile.jsx
│   │   ├── EditProfile.jsx
│   │   ├── SkillsManager.jsx
│   │   ├── AvailabilityManager.jsx
│   │   └── ProfileStats.jsx
│   └── Credits/
│       ├── CreditDashboard.jsx
│       ├── TransactionHistory.jsx
│       └── CreditStats.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   ├── DiscoverPage.jsx
│   ├── MessagesPage.jsx
│   ├── SessionsPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useSocket.js
│   ├── usePagination.js
│   ├── useInfiniteScroll.js
│   └── useDebounce.js
├── context/
│   ├── AuthContext.jsx
│   ├── SocketContext.jsx
│   └── NotificationContext.jsx
├── utils/
│   ├── api.js
│   ├── constants.js
│   ├── helpers.js
│   └── validation.js
└── styles/
    └── globals.css
```

### Key Component Examples

#### Discover Page with Infinite Scroll
```jsx
// pages/DiscoverPage.jsx
import React, { useState, useCallback } from 'react';
import InfiniteScroll from '../components/Common/InfiniteScroll';
import UserCard from '../components/Discover/UserCard';
import SkillFilter from '../components/Discover/SkillFilter';
import { discoverUsers } from '../utils/api';

const DiscoverPage = () => {
  const [filters, setFilters] = useState({
    skill: '',
    category: '',
    language: '',
    minRating: ''
  });

  const fetchUsers = useCallback(async ({ cursor }) => {
    const response = await discoverUsers({
      cursor,
      limit: 12,
      ...filters
    });
    return response.data;
  }, [filters]);

  const renderUserCard = useCallback((user, index) => (
    <UserCard key={user._id} user={user} />
  ), []);

  const LoadingComponent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64" />
      ))}
    </div>
  );

  const EmptyComponent = () => (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No users found
      </h3>
      <p className="text-gray-500">
        Try adjusting your filters or search criteria
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Discover Skills
        </h1>
        
        <SkillFilter filters={filters} onFiltersChange={setFilters} />
        
        <div className="mt-8">
          <InfiniteScroll
            fetchData={fetchUsers}
            renderItem={renderUserCard}
            loadingComponent={LoadingComponent}
            emptyComponent={EmptyComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
```

#### Chat Window with Pagination
```jsx
// components/Messages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getChatMessages, sendMessage } from '../../utils/api';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatWindow = ({ otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const loadMessages = async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return;
    
    setLoading(true);
    try {
      const response = await getChatMessages(otherUser._id, {
        cursor: isInitial ? null : cursor,
        limit: 20
      });
      
      const { data, pagination } = response.data;
      
      if (isInitial) {
        setMessages(data);
        scrollToBottom();
      } else {
        setMessages(prev => [...data, ...prev]);
      }
      
      setHasMore(pagination.hasMore);
      setCursor(pagination.nextCursor);
      
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      const response = await sendMessage({
        receiver: otherUser._id,
        content,
        messageType: 'text'
      });
      
      setMessages(prev => [...prev, response.data]);
      scrollToBottom();
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const { scrollTop } = chatContainerRef.current;
    if (scrollTop === 0 && hasMore && !loading) {
      loadMessages();
    }
  };

  useEffect(() => {
    loadMessages(true);
  }, [otherUser._id]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center">
          <img
            src={otherUser.profilePicture || '/default-avatar.png'}
            alt={otherUser.fullName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {otherUser.fullName}
            </h3>
            <p className="text-sm text-gray-500">
              {otherUser.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {loading && messages.length === 0 && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto" />
          </div>
        )}
        
        {hasMore && messages.length > 0 && (
          <div className="text-center py-2">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto" />
            ) : (
              <button
                onClick={() => loadMessages()}
                className="text-blue-500 text-sm hover:underline"
              >
                Load older messages
              </button>
            )}
          </div>
        )}
        
        {messages.map(message => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={message.sender._id === currentUser.id}
          />
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
```

---

## 🌐 Real-time Features

### Socket.IO Implementation

#### Server-side Socket Configuration
```javascript
// server.js - Socket.IO setup
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error('User not found'));
    }
    
    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// Online users tracking
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User ${socket.user.username} connected`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, {
    socketId: socket.id,
    user: socket.user,
    lastSeen: new Date()
  });
  
  // Notify friends about online status
  socket.broadcast.emit('user:online', {
    userId: socket.userId,
    username: socket.user.username
  });
  
  // Join user's personal room for direct notifications
  socket.join(`user:${socket.userId}`);
  
  // Handle joining conversation rooms
  socket.on('join:conversation', (otherUserId) => {
    const roomId = [socket.userId, otherUserId].sort().join(':');
    socket.join(`conversation:${roomId}`);
  });
  
  // Handle leaving conversation rooms
  socket.on('leave:conversation', (otherUserId) => {
    const roomId = [socket.userId, otherUserId].sort().join(':');
    socket.leave(`conversation:${roomId}`);
  });
  
  // Handle real-time messaging
  socket.on('message:send', async (data) => {
    try {
      const { receiverId, content, messageType = 'text' } = data;
      
      // Save message to database
      const message = new Message({
        sender: socket.userId,
        receiver: receiverId,
        content,
        messageType
      });
      await message.save();
      await message.populate('sender receiver');
      
      // Send to conversation room
      const roomId = [socket.userId, receiverId].sort().join(':');
      io.to(`conversation:${roomId}`).emit('message:received', message);
      
      // Send push notification to receiver if offline
      if (!onlineUsers.has(receiverId)) {
        // Queue for push notification
        await queuePushNotification(receiverId, {
          title: `New message from ${socket.user.fullName}`,
          body: content.substring(0, 100),
          type: 'message'
        });
      }
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing:start', (receiverId) => {
    const roomId = [socket.userId, receiverId].sort().join(':');
    socket.to(`conversation:${roomId}`).emit('typing:start', {
      userId: socket.userId,
      username: socket.user.username
    });
  });
  
  socket.on('typing:stop', (receiverId) => {
    const roomId = [socket.userId, receiverId].sort().join(':');
    socket.to(`conversation:${roomId}`).emit('typing:stop', {
      userId: socket.userId
    });
  });
  
  // Handle session events
  socket.on('session:start', async (sessionId) => {
    try {
      const session = await Session.findById(sessionId)
        .populate('teacher student');
      
      if (!session) {
        return socket.emit('error', { message: 'Session not found' });
      }
      
      // Notify both participants
      io.to(`user:${session.teacher._id}`).emit('session:started', session);
      io.to(`user:${session.student._id}`).emit('session:started', session);
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to start session' });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.username} disconnected`);
    
    // Remove from online users
    onlineUsers.delete(socket.userId);
    
    // Update last seen
    User.findByIdAndUpdate(socket.userId, { 
      lastSeen: new Date() 
    }).exec();
    
    // Notify friends about offline status
    socket.broadcast.emit('user:offline', {
      userId: socket.userId,
      username: socket.user.username
    });
  });
});

// Utility function for push notifications
async function queuePushNotification(userId, notification) {
  // Implementation depends on your push notification service
  // Could use Firebase, OneSignal, or custom implementation
  console.log(`Queuing notification for user ${userId}:`, notification);
}

module.exports = { app, server, io };
```

#### Client-side Socket Integration
```javascript
// utils/socket.js
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.REACT_APP_SERVER_URL, {
      auth: { token },
      transports: ['polling', 'websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Messaging methods
  joinConversation(otherUserId) {
    if (this.socket) {
      this.socket.emit('join:conversation', otherUserId);
    }
  }

  leaveConversation(otherUserId) {
    if (this.socket) {
      this.socket.emit('leave:conversation', otherUserId);
    }
  }

  sendMessage(receiverId, content, messageType = 'text') {
    if (this.socket) {
      this.socket.emit('message:send', {
        receiverId,
        content,
        messageType
      });
    }
  }

  // Typing indicators
  startTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing:start', receiverId);
    }
  }

  stopTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing:stop', receiverId);
    }
  }

  // Session methods
  startSession(sessionId) {
    if (this.socket) {
      this.socket.emit('session:start', sessionId);
    }
  }

  // Event listeners
  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('message:received', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user:online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user:offline', callback);
    }
  }

  onTypingStart(callback) {
    if (this.socket) {
      this.socket.on('typing:start', callback);
    }
  }

  onTypingStop(callback) {
    if (this.socket) {
      this.socket.on('typing:stop', callback);
    }
  }

  onSessionStarted(callback) {
    if (this.socket) {
      this.socket.on('session:started', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
```

---

## 🔒 Security & Authentication

### JWT Implementation
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

module.exports = auth;
```

### Input Validation
```javascript
// middleware/validation.js
const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  sendMessage: Joi.object({
    receiver: Joi.string().hex().length(24).required(),
    content: Joi.string().max(1000).required(),
    messageType: Joi.string().valid('text', 'session_request').default('text')
  }),
  
  createSession: Joi.object({
    teacher: Joi.string().hex().length(24).required(),
    skill: Joi.string().required(),
    scheduledTime: Joi.date().greater('now').required(),
    duration: Joi.number().min(15).max(240).required(),
    description: Joi.string().max(500)
  })
};

module.exports = { validate, schemas };
```

---

## 🚀 Deployment Strategy

### Environment Configuration
```bash
# .env.production
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbarter

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=https://yourapp.vercel.app

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Jitsi Meet
JITSI_DOMAIN=meet.jit.si
JITSI_APP_ID=your-app-id

# Redis (for session storage - optional)
REDIS_URL=redis://localhost:6379
```

### Railway Deployment Configuration
```yaml
# railway.yml
version: 2
build:
  builder: DOCKERFILE
deploy:
  startCommand: npm run start
  restartPolicyType: ON_FAILURE
  restartPolicyMaxRetries: 10
healthcheckPath: /api/health
healthcheckTimeout: 30
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Production Optimization
```javascript
// server.js - Production optimizations
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgra
