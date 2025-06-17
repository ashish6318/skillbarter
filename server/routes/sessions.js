const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');
const { validateSession, validateRating } = require('../middleware/validation');
const { sessionRateLimit } = require('../middleware/rateLimiting');

// Apply rate limiting to all session routes
router.use(sessionRateLimit);

// All routes require authentication
router.use(protect);

// Get user's sessions
router.get('/', sessionController.getSessions);

// Get specific session
router.get('/:id', sessionController.getSession);

// Create new session
router.post('/', validateSession, sessionController.createSession);

// Update session
router.put('/:id', validateSession, sessionController.updateSession);

// Delete session
router.delete('/:id', sessionController.deleteSession);

// Update session status
router.patch('/:id/status', sessionController.updateSessionStatus);

// Rate session
router.post('/:id/rate', validateRating, sessionController.rateSession);

// Get available time slots for a user
router.get('/user/:userId/slots', sessionController.getAvailableSlots);

module.exports = router;
