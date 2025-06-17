const rateLimit = require('express-rate-limit');

// Global rate limiter
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

// Authentication rate limiter - stricter for login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime)
    });
  }
});

// Messaging rate limiter - prevent message spam
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Max 10 messages per minute
  message: {
    error: 'Message rate limit exceeded',
    retryAfter: '1 minute'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Message rate limit exceeded. Please slow down.',
      retryAfter: Math.round(req.rateLimit.resetTime)
    });
  }
});

// Discover page rate limiter - prevent scraping
const discoverLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Max 50 discover requests per 5 minutes
  message: {
    error: 'Discover rate limit exceeded',
    retryAfter: '5 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many search requests. Please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime)
    });
  }
});

// Session creation rate limiter
const sessionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 session requests per hour
  message: {
    error: 'Session creation limit exceeded',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Session creation limit exceeded. Please wait before creating more sessions.',
      retryAfter: Math.round(req.rateLimit.resetTime)
    });
  }
});

// Session rate limiter
const sessionRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Max 20 session operations per 5 minutes
  message: {
    error: 'Session rate limit exceeded',
    retryAfter: '5 minutes'
  }
});

// Credit rate limiter - more restrictive for financial operations
const creditRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Max 10 credit operations per 10 minutes
  message: {
    error: 'Credit operation rate limit exceeded',
    retryAfter: '10 minutes'
  }
});

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

module.exports = {
  globalLimiter,
  authLimiter,
  messageLimiter,
  discoverLimiter,
  sessionLimiter,
  sessionRateLimit: sessionLimiter, // Use sessionLimiter as sessionRateLimit
  creditRateLimit: rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Max 10 credit operations per 10 minutes
    message: {
      error: 'Credit operation rate limit exceeded',
      retryAfter: '10 minutes'
    }
  }),
  userBasedLimiter
};
