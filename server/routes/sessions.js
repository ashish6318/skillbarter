const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');
const { validateSession, validateRating, validateSessionUpdate } = require('../middleware/validation');
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
router.put('/:id', validateSessionUpdate, sessionController.updateSession);

// Delete/Cancel session
router.delete('/:id', sessionController.cancelSession);

// Update session status
router.patch('/:id/status', validateSessionUpdate, sessionController.updateSessionStatus);

// Reschedule session
router.put('/:id/reschedule', sessionController.rescheduleSession);

// Start session
router.post('/:id/start', sessionController.startSession);

// End session
router.post('/:id/end', sessionController.endSession);

// Get video room details
router.get('/:id/room', sessionController.getRoomDetails);

// Submit session review
router.post('/:id/review', sessionController.reviewSession);

// Rate session (legacy endpoint for backward compatibility)
router.post('/:id/rate', validateRating, sessionController.rateSession);

// Get available time slots for a user
router.get('/user/:teacherId/slots', sessionController.getAvailableSlots);

module.exports = router;
