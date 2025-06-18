const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    console.log('Validating request body:', req.body);
    const { error } = schema.validate(req.body);
    
    if (error) {
      console.log('Validation failed:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    console.log('Validation passed');
    next();
  };
};

// Validation schemas
const schemas = {  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    bio: Joi.string().max(500).optional(),
    country: Joi.string().optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    skillsOffered: Joi.array().items(Joi.object({
      skill: Joi.string().required(),
      category: Joi.string().optional(),
      experience: Joi.string().valid('Beginner', 'Intermediate', 'Expert').optional(),
      description: Joi.string().max(200).optional()
    })).optional(),
    skillsWanted: Joi.array().items(Joi.object({
      skill: Joi.string().required(),
      category: Joi.string().optional(),
      level: Joi.string().valid('Beginner', 'Intermediate', 'Expert').optional(),
      priority: Joi.string().valid('Low', 'Medium', 'High').optional()
    })).optional()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
    updateProfile: Joi.object({
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
    title: Joi.string().max(100).optional(),
    bio: Joi.string().max(500).optional(),
    country: Joi.string().optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    timezone: Joi.string().optional()
  }),
  
  addSkillOffered: Joi.object({
    skill: Joi.string().required(),
    category: Joi.string().valid('Technology', 'Design', 'Business', 'Language', 'Music', 'Sports', 'Cooking', 'Other').required(),
    experience: Joi.string().valid('Beginner', 'Intermediate', 'Expert').default('Intermediate'),
    description: Joi.string().max(200).optional()
  }),
  
  addSkillWanted: Joi.object({
    skill: Joi.string().required(),
    category: Joi.string().optional(),
    level: Joi.string().valid('Beginner', 'Intermediate', 'Expert').default('Beginner'),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium')
  }),
  
  sendMessage: Joi.object({
    receiver: Joi.string().hex().length(24).required(),
    content: Joi.string().max(1000).required(),
    messageType: Joi.string().valid('text', 'session_request').default('text'),
    sessionData: Joi.object({
      skill: Joi.string().optional(),
      duration: Joi.number().min(15).max(240).optional(),
      proposedTime: Joi.date().greater('now').optional(),
      description: Joi.string().max(500).optional()
    }).optional()
  }),
  
  createSession: Joi.object({
    teacher: Joi.string().hex().length(24).required(),
    skill: Joi.string().required(),
    scheduledTime: Joi.date().greater('now').required(),
    duration: Joi.number().min(15).max(240).required(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().optional()
  }),
  
  updateAvailability: Joi.object({
    availability: Joi.array().items(
      Joi.object({
        day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        timeSlots: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
          })
        ).required()
      })
    ).required()
  }),
  
  sessionReview: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    feedback: Joi.string().max(500).optional(),
    wouldRecommend: Joi.boolean().optional()
  }),

  creditPurchase: Joi.object({
    amount: Joi.number().positive().required(),
    paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer').required()
  }),

  creditTransfer: Joi.object({
    toUserId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().max(200).optional()
  }),

  rating: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    review: Joi.string().max(500).optional()
  }),  session: Joi.object({
    teacher: Joi.string().hex().length(24).required(),
    skill: Joi.string().required(),
    scheduledFor: Joi.string().isoDate().required(),
    duration: Joi.number().min(15).max(240).required(),
    message: Joi.string().max(500).allow('').optional()
  }),
  sessionUpdate: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'in_progress', 'completed').required(),
    reason: Joi.string().max(500).allow(null).optional()
  })
};

// Additional validation middleware functions
const validateLogin = validate(schemas.login);
const validateRegister = validate(schemas.register);
const validateProfile = validate(schemas.profile);
const validateMessage = validate(schemas.message);
const validateAvailability = validate(schemas.updateAvailability);
const validateSessionReview = validate(schemas.sessionReview);
const validateCreditPurchase = validate(schemas.creditPurchase);
const validateCreditTransfer = validate(schemas.creditTransfer);
const validateRating = validate(schemas.rating);
const validateSession = validate(schemas.session);
const validateSessionUpdate = validate(schemas.sessionUpdate);

module.exports = { 
  validate, 
  schemas,
  validateLogin,
  validateRegister,
  validateProfile,
  validateMessage,
  validateAvailability,
  validateSessionReview,
  validateCreditPurchase,
  validateCreditTransfer,
  validateRating,
  validateSession,
  validateSessionUpdate
};
