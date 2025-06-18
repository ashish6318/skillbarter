require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Import middleware
const { globalLimiter } = require('./middleware/rateLimiting');

// Import services
const ReminderService = require('./services/reminderService');

// Import routes
const authRoutes = require('./routes/auth');
const discoverRoutes = require('./routes/discover');
const messagesRoutes = require('./routes/messages');
const sessionsRoutes = require('./routes/sessions');
const reminderRoutes = require('./routes/reminders');
const creditsRoutes = require('./routes/credits');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true
  }
});

// Make io available to routes
app.set('io', io);

// Initialize reminder service
let reminderService;

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
app.use(globalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Skill Barter Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/credits', creditsRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication failed - no token'));
    }

    const jwt = require('jsonwebtoken');
    const User = require('./models/User');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive || user.isBanned) {
      return next(new Error('Authentication failed - invalid user'));
    }
    
    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// Online users tracking
const onlineUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User ${socket.user.username} connected (${socket.id})`);
  
  // Add user to online users
  onlineUsers.set(socket.userId, {
    socketId: socket.id,
    user: socket.user,
    lastSeen: new Date()
  });
  
  // Send current online users to the newly connected user
  const currentOnlineUsers = Array.from(onlineUsers.keys());
  socket.emit('users:online', currentOnlineUsers);
  
  // Notify others about online status
  socket.broadcast.emit('user:online', {
    userId: socket.userId,
    username: socket.user.username
  });
  
  // Join user's personal room for notifications
  socket.join(`user:${socket.userId}`);
  
  // Handle conversation room joining
  socket.on('join:conversation', (otherUserId) => {
    const roomId = [socket.userId, otherUserId].sort().join(':');
    socket.join(`conversation:${roomId}`);
    console.log(`User ${socket.user.username} joined conversation room: ${roomId}`);
  });
  
  // Handle conversation room leaving
  socket.on('leave:conversation', (otherUserId) => {
    const roomId = [socket.userId, otherUserId].sort().join(':');
    socket.leave(`conversation:${roomId}`);
    console.log(`User ${socket.user.username} left conversation room: ${roomId}`);
  });
  
  // Handle real-time messaging
  socket.on('message:send', async (data) => {
    try {
      const { receiverId, content, messageType = 'text' } = data;
      const Message = require('./models/Message');
      
      // Create and save message
      const message = new Message({
        sender: socket.userId,
        receiver: receiverId,
        content,
        messageType
      });
      
      await message.save();
      await message.populate('sender receiver');
      
      // Send to conversation room
      const roomId = [socket.userId, receiverId].sort().join(':');
      io.to(`conversation:${roomId}`).emit('message:received', message);
      
      console.log(`Message sent from ${socket.user.username} to conversation ${roomId}`);
      
    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing:start', (receiverId) => {
    const roomId = [socket.userId, receiverId].sort().join(':');
    socket.to(`conversation:${roomId}`).emit('typing:start', {
      userId: socket.userId,
      username: socket.user.username
    });
  });
  
  socket.on('typing:stop', (receiverId) => {
    const roomId = [socket.userId, receiverId].sort().join(':');
    socket.to(`conversation:${roomId}`).emit('typing:stop', {
      userId: socket.userId
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.username} disconnected`);
    
    // Remove from online users
    onlineUsers.delete(socket.userId);
    
    // Update last seen in database
    const User = require('./models/User');
    User.findByIdAndUpdate(socket.userId, { 
      lastSeen: new Date() 
    }).exec().catch(console.error);
    
    // Notify others about offline status
    socket.broadcast.emit('user:offline', {
      userId: socket.userId,
      username: socket.user.username
    });
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbarter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize reminder service after database connection
  reminderService = new ReminderService(io);
  app.set('reminderService', reminderService);
  console.log('📅 Reminder service initialized');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Skill Barter Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
