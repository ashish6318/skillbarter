const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');
const { protect } = require('../middleware/auth');
const { validateCreditPurchase, validateCreditTransfer } = require('../middleware/validation');
const { creditRateLimit } = require('../middleware/rateLimiting');

// Apply rate limiting to all credit routes
router.use(creditRateLimit);

// All routes require authentication
router.use(protect);

// Get user's credit balance
router.get('/balance', creditController.getCreditBalance);

// Get credit transaction history
router.get('/history', creditController.getCreditHistory);

// Get credit statistics
router.get('/stats', creditController.getCreditStats);

// Purchase credits
router.post('/purchase', validateCreditPurchase, creditController.purchaseCredits);

// Transfer credits
router.post('/transfer', validateCreditTransfer, creditController.transferCredits);

module.exports = router;
