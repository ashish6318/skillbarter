const express = require('express');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiting');
const {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  verifyEmail
} = require('../controllers/authController');

const router = express.Router();

// Authentication routes with rate limiting
router.post('/register', authLimiter, validate(schemas.register), register);
router.post('/login', authLimiter, validate(schemas.login), login);
router.post('/logout', auth, logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-email', verifyEmail);

// Profile routes (protected)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate(schemas.updateProfile), updateProfile);

module.exports = router;
