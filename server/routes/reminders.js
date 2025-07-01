const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Get reminder service instance from the app
const getReminderService = (req) => {
  return req.app.get('reminderService');
};

// Get reminder statistics (admin only)
router.get('/stats', protect, async (req, res) => {
  try {
    const reminderService = getReminderService(req);
    if (!reminderService) {
      return res.status(503).json({ error: 'Reminder service not available' });
    }

    const stats = await reminderService.getReminderStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching reminder stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send manual reminder (admin/testing only)
router.post('/send/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reminderType = '15min' } = req.body;
    
    const reminderService = getReminderService(req);
    if (!reminderService) {
      return res.status(503).json({ error: 'Reminder service not available' });
    }

    // Validate reminder type
    if (!['24h', '1h', '15min'].includes(reminderType)) {
      return res.status(400).json({ error: 'Invalid reminder type' });
    }

    const result = await reminderService.sendManualReminder(sessionId, reminderType);
    res.json(result);
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;
