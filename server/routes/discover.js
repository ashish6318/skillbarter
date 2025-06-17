const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { discoverLimiter } = require('../middleware/rateLimiting');
const {
  getDiscoverUsers,
  searchUsers,
  getCategories,
  getTrendingSkills,
  getUserProfile
} = require('../controllers/discoverController');

const router = express.Router();

// Discovery routes (some with optional auth for personalization)
router.get('/', discoverLimiter, optionalAuth, getDiscoverUsers);
router.get('/search', discoverLimiter, optionalAuth, searchUsers);
router.get('/categories', getCategories);
router.get('/trending', getTrendingSkills);
router.get('/:id', optionalAuth, getUserProfile);

module.exports = router;
