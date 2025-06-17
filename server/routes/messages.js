const express = require('express');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { messageLimiter } = require('../middleware/rateLimiting');
const {
  getConversation,
  getConversations,
  sendMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');

const router = express.Router();

// All message routes require authentication
router.use(auth);

// Get all conversations for current user
router.get('/conversations', getConversations);

// Get conversation with specific user
router.get('/:userId', getConversation);

// Send message (with rate limiting)
router.post('/send', messageLimiter, validate(schemas.sendMessage), sendMessage);

// Mark messages as read
router.put('/:userId/read', markAsRead);

// Delete message
router.delete('/:messageId', deleteMessage);

module.exports = router;
