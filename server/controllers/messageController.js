const Message = require('../models/Message');
const User = require('../models/User');
const { paginateWithOffset } = require('../utils/pagination');
const { formatError } = require('../utils/helpers');

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
      // Validate that the other user exists
    const otherUser = await User.findById(userId).select('firstName lastName profilePicture isOnline');
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
    };    const result = await paginateWithOffset(
      Message,
      query,
      { 
        page, 
        limit,
        sortField: 'createdAt',
        sortOrder: -1,
        populate: 'sender receiver'
      }
    );    res.json({
      success: true,
      conversation: result.data.reverse(), // Reverse to show oldest first
      pagination: result.pagination,
      otherUser: {
        id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
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
    console.log('📋 GET /api/messages/conversations called by user:', req.user?.username || req.user?.id);
    const currentUserId = req.user.id;
    console.log('📋 Current user ID:', currentUserId, typeof currentUserId);
    
    // Convert string ID to ObjectId for MongoDB aggregation
    const mongoose = require('mongoose');
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    console.log('📋 Converted to ObjectId:', currentUserObjectId);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Get latest message from each conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserObjectId },
            { receiver: currentUserObjectId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {        _id: {
          $cond: [
            { $eq: ['$sender', currentUserObjectId] },
            '$receiver',
            '$sender'
          ]
        },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [              {
                $and: [
                  { $eq: ['$receiver', currentUserObjectId] },
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
      },      {        $project: {
          otherUser: {
            _id: '$otherUser._id',  // Changed from 'id' to '_id' for consistency
            firstName: '$otherUser.firstName',
            lastName: '$otherUser.lastName',
            profilePicture: '$otherUser.profilePicture',
            isOnline: '$otherUser.isOnline'
          },          lastMessage: {
            id: '$lastMessage._id',
            content: '$lastMessage.content',
            messageType: '$lastMessage.messageType',
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
    ]);    const totalConversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserObjectId },
            { receiver: currentUserObjectId }
          ]
        }
      },
      {
        $group: {        _id: {
          $cond: [
            { $eq: ['$sender', currentUserObjectId] },
            '$receiver',
            '$sender'
          ]
        }
        }
      },
      {
        $count: 'total'
      }
    ]);    const total = totalConversations[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    console.log('📋 Returning conversations:', conversations.length);
    console.log('📋 First conversation:', conversations[0]);

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
    const { receiver, content, messageType = 'text' } = req.body;
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
      messageType
    });

    await message.save();
    await message.populate('sender receiver', 'firstName lastName profilePicture');    // Emit to socket if receiver is online
    const io = req.app.get('io');
    if (io) {
      const roomId = [sender, receiver].sort().join(':');
      io.to(`conversation:${roomId}`).emit('message:received', {
        _id: message._id,
        sender: {
          _id: message.sender._id,
          firstName: message.sender.firstName,
          lastName: message.sender.lastName,
          profilePicture: message.sender.profilePicture
        },
        receiver: {
          _id: message.receiver._id,
          firstName: message.receiver.firstName,
          lastName: message.receiver.lastName,
          profilePicture: message.receiver.profilePicture
        },
        content: message.content,
        messageType: message.messageType,
        isRead: message.isRead,
        createdAt: message.createdAt
      });
      
      console.log(`Message emitted to conversation room: conversation:${roomId}`);
    }    res.status(201).json({
      message: {
        _id: message._id,
        sender: {
          _id: message.sender._id,
          firstName: message.sender.firstName,
          lastName: message.sender.lastName,
          profilePicture: message.sender.profilePicture
        },
        receiver: {
          _id: message.receiver._id,
          firstName: message.receiver.firstName,
          lastName: message.receiver.lastName,
          profilePicture: message.receiver.profilePicture
        },
        content: message.content,
        messageType: message.messageType,
        isRead: message.isRead,
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
