const Message = require('../models/Message');
const User = require('../models/User');
const { validateMessage } = require('../middleware/validation');
const { getPaginatedResults } = require('../utils/pagination');
const { formatError } = require('../utils/helpers');

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    
    // Validate that the other user exists
    const otherUser = await User.findById(userId).select('name profilePicture');
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const query = {
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    };

    const result = await getPaginatedResults(
      Message,
      query,
      { sort: { createdAt: -1 }, populate: 'sender receiver', select: '-__v' },
      page,
      limit
    );

    res.json({
      conversation: result.data.reverse(), // Reverse to show oldest first
      pagination: result.pagination,
      otherUser: {
        id: otherUser._id,
        name: otherUser.name,
        profilePicture: otherUser.profilePicture
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all conversations for current user
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Get latest message from each conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', currentUserId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', currentUserId] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $project: {
          otherUser: {
            id: '$otherUser._id',
            name: '$otherUser.name',
            profilePicture: '$otherUser.profilePicture',
            isOnline: '$otherUser.isOnline'
          },
          lastMessage: {
            id: '$lastMessage._id',
            content: '$lastMessage.content',
            type: '$lastMessage.type',
            createdAt: '$lastMessage.createdAt',
            sender: '$lastMessage.sender'
          },
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);

    const totalConversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', currentUserId] },
              '$receiver',
              '$sender'
            ]
          }
        }
      },
      {
        $count: 'total'
      }
    ]);

    const total = totalConversations[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      conversations,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { error } = validateMessage(req.body);
    if (error) {
      return res.status(400).json({ error: formatError(error) });
    }

    const { receiver, content, type = 'text' } = req.body;
    const sender = req.user.id;

    // Validate receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Create message
    const message = new Message({
      sender,
      receiver,
      content,
      type
    });

    await message.save();
    await message.populate('sender receiver', 'name profilePicture');

    // Emit to socket if receiver is online
    const io = req.app.get('io');
    if (io) {
      io.to(receiver).emit('newMessage', {
        id: message._id,
        sender: {
          id: message.sender._id,
          name: message.sender.name,
          profilePicture: message.sender.profilePicture
        },
        receiver: {
          id: message.receiver._id,
          name: message.receiver.name,
          profilePicture: message.receiver.profilePicture
        },
        content: message.content,
        type: message.type,
        read: message.read,
        createdAt: message.createdAt
      });
    }

    res.status(201).json({
      message: {
        id: message._id,
        sender: {
          id: message.sender._id,
          name: message.sender.name,
          profilePicture: message.sender.profilePicture
        },
        receiver: {
          id: message.receiver._id,
          name: message.receiver.name,
          profilePicture: message.receiver.profilePicture
        },
        content: message.content,
        type: message.type,
        read: message.read,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        read: false
      },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user.id;

    const message = await Message.findOne({
      _id: messageId,
      sender: currentUserId
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getConversation,
  getConversations,
  sendMessage,
  markAsRead,
  deleteMessage
};
