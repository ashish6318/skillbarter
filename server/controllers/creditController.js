const CreditTransaction = require('../models/CreditTransaction');
const User = require('../models/User');
const { createPaginationResponse } = require('../utils/pagination');
const { 
  CREDIT_TRANSACTION_TYPES,
  CREDIT_TRANSACTION_STATUS 
} = require('../utils/constants');

// Get user's credit balance
const getCreditBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('credits');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        balance: user.credits
      }
    });
  } catch (error) {
    console.error('Get credit balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credit balance'
    });
  }
};

// Get credit transaction history
const getCreditHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    
    const filter = {
      $or: [
        { fromUser: req.user.id },
        { toUser: req.user.id }
      ]
    };

    if (type && Object.values(CREDIT_TRANSACTION_TYPES).includes(type)) {
      filter.type = type;
    }

    if (status && Object.values(CREDIT_TRANSACTION_STATUS).includes(status)) {
      filter.status = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'fromUser', select: 'name profilePicture' },
        { path: 'toUser', select: 'name profilePicture' },
        { path: 'session', select: 'title startTime' }
      ]
    };

    const result = await CreditTransaction.paginate(filter, options);
    
    const response = createPaginationResponse(result, req);

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Get credit history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credit history'
    });
  }
};

// Purchase credits (mock implementation - would integrate with payment gateway)
const purchaseCredits = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    // Basic validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }
    
    // Mock payment processing
    // In production, integrate with Stripe, PayPal, etc.
    const transaction = new CreditTransaction({
      fromUser: null, // System purchase
      toUser: req.user.id,
      amount,
      type: CREDIT_TRANSACTION_TYPES.PURCHASE,
      status: CREDIT_TRANSACTION_STATUS.COMPLETED,
      description: `Credit purchase via ${paymentMethod}`,
      metadata: {
        paymentMethod,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });

    await transaction.save();

    // Update user's credit balance
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: amount } }
    );

    await transaction.populate([
      { path: 'toUser', select: 'name profilePicture' }
    ]);

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Credits purchased successfully'
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase credits'
    });
  }
};

// Transfer credits between users
const transferCredits = async (req, res) => {
  try {
    const { toUserId, amount, description } = req.body;
    
    // Basic validation
    if (!toUserId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transfer data'
      });
    }
    
    if (toUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer credits to yourself'
      });
    }

    // Check if sender has enough credits
    const fromUser = await User.findById(req.user.id);
    if (!fromUser || fromUser.credits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credit balance'
      });
    }

    // Check if recipient exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Create transaction
    const transaction = new CreditTransaction({
      fromUser: req.user.id,
      toUser: toUserId,
      amount,
      type: CREDIT_TRANSACTION_TYPES.TRANSFER,
      status: CREDIT_TRANSACTION_STATUS.COMPLETED,
      description: description || 'Credit transfer'
    });

    await transaction.save();

    // Update both users' credit balances
    await User.findByIdAndUpdate(req.user.id, { $inc: { credits: -amount } });
    await User.findByIdAndUpdate(toUserId, { $inc: { credits: amount } });

    await transaction.populate([
      { path: 'fromUser', select: 'name profilePicture' },
      { path: 'toUser', select: 'name profilePicture' }
    ]);

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Credits transferred successfully'
    });
  } catch (error) {
    console.error('Transfer credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer credits'
    });
  }
};

// Get credit statistics
const getCreditStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query;

    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const [earned, spent, transferred] = await Promise.all([
      // Credits earned (received)
      CreditTransaction.aggregate([
        {
          $match: {
            toUser: userId,
            status: CREDIT_TRANSACTION_STATUS.COMPLETED,
            ...dateFilter
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      
      // Credits spent (sent)
      CreditTransaction.aggregate([
        {
          $match: {
            fromUser: userId,
            status: CREDIT_TRANSACTION_STATUS.COMPLETED,
            ...dateFilter
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),

      // Transfer history
      CreditTransaction.find({
        $or: [
          { fromUser: userId },
          { toUser: userId }
        ],
        type: CREDIT_TRANSACTION_TYPES.TRANSFER,
        status: CREDIT_TRANSACTION_STATUS.COMPLETED,
        ...dateFilter
      }).countDocuments()
    ]);

    const user = await User.findById(userId).select('credits');

    res.json({
      success: true,
      data: {
        currentBalance: user.credits,
        period,
        earned: earned[0]?.total || 0,
        spent: spent[0]?.total || 0,
        transfers: transferred
      }
    });
  } catch (error) {
    console.error('Get credit stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get credit statistics'
    });
  }
};

module.exports = {
  getCreditBalance,
  getCreditHistory,
  purchaseCredits,
  transferCredits,
  getCreditStats
};
