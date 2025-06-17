const Session = require('../models/Session');
const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');
const { validateSession, validateSessionUpdate } = require('../middleware/validation');
const { getPaginatedResults, getCursorPaginatedResults } = require('../utils/pagination');
const { formatError, processCredits } = require('../utils/helpers');
const { addHours, isBefore, isAfter, parseISO } = require('date-fns');

// Get user's sessions (as teacher or student)
const getSessions = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { role, status, cursor, limit = 10 } = req.query;

    let query = {};

    // Filter by role
    if (role === 'teacher') {
      query.teacher = currentUserId;
    } else if (role === 'student') {
      query.student = currentUserId;
    } else {
      query.$or = [
        { teacher: currentUserId },
        { student: currentUserId }
      ];
    }

    // Filter by status
    if (status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      query.status = status;
    }

    const populate = [
      { path: 'teacher', select: 'name profilePicture skills rating' },
      { path: 'student', select: 'name profilePicture' }
    ];

    let result;
    if (cursor) {
      result = await getCursorPaginatedResults(
        Session,
        query,
        { sort: { createdAt: -1 }, populate },
        cursor,
        parseInt(limit)
      );
    } else {
      const page = parseInt(req.query.page) || 1;
      result = await getPaginatedResults(
        Session,
        query,
        { sort: { createdAt: -1 }, populate },
        page,
        parseInt(limit)
      );
    }

    res.json({
      sessions: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get session details
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const currentUserId = req.user.id;

    const session = await Session.findById(sessionId)
      .populate('teacher', 'name profilePicture skills rating')
      .populate('student', 'name profilePicture');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a session request
const createSession = async (req, res) => {
  try {
    const { error } = validateSession(req.body);
    if (error) {
      return res.status(400).json({ error: formatError(error) });
    }

    const { teacher, skill, scheduledFor, duration, message } = req.body;
    const student = req.user.id;

    // Validate teacher exists and has the skill
    const teacherUser = await User.findById(teacher);
    if (!teacherUser) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (!teacherUser.skills.includes(skill)) {
      return res.status(400).json({ error: 'Teacher does not offer this skill' });
    }

    // Check if scheduled time is in the future
    const scheduledDate = parseISO(scheduledFor);
    if (isBefore(scheduledDate, new Date())) {
      return res.status(400).json({ error: 'Session must be scheduled for a future time' });
    }

    // Check student has enough credits
    const studentUser = await User.findById(student);
    const requiredCredits = Math.ceil(duration / 60); // 1 credit per hour
    
    if (studentUser.credits < requiredCredits) {
      return res.status(400).json({ 
        error: `Insufficient credits. Required: ${requiredCredits}, Available: ${studentUser.credits}` 
      });
    }

    // Create session
    const session = new Session({
      teacher,
      student,
      skill,
      scheduledFor: scheduledDate,
      duration,
      message,
      status: 'pending'
    });

    await session.save();
    await session.populate('teacher', 'name profilePicture skills rating');
    await session.populate('student', 'name profilePicture');

    // Emit notification to teacher
    const io = req.app.get('io');
    if (io) {
      io.to(teacher).emit('sessionRequest', {
        sessionId: session._id,
        student: {
          id: session.student._id,
          name: session.student.name,
          profilePicture: session.student.profilePicture
        },
        skill,
        scheduledFor: session.scheduledFor,
        duration,
        message
      });
    }

    res.status(201).json({ session });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update session status (accept/reject/cancel)
const updateSessionStatus = async (req, res) => {
  try {
    const { error } = validateSessionUpdate(req.body);
    if (error) {
      return res.status(400).json({ error: formatError(error) });
    }

    const { sessionId } = req.params;
    const { status, reason } = req.body;
    const currentUserId = req.user.id;

    const session = await Session.findById(sessionId)
      .populate('teacher', 'name profilePicture')
      .populate('student', 'name profilePicture');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check permissions based on status change
    if (status === 'confirmed' && session.teacher._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Only teacher can confirm sessions' });
    }

    if (status === 'cancelled') {
      if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
        return res.status(403).json({ error: 'Only participants can cancel sessions' });
      }
    }

    // Handle status transitions
    if (status === 'confirmed' && session.status === 'pending') {
      // Deduct credits from student when session is confirmed
      const requiredCredits = Math.ceil(session.duration / 60);
      await processCredits(session.student._id, -requiredCredits, 'session_booking', `Session booking: ${session.skill}`, session._id);
    } else if (status === 'cancelled' && session.status === 'confirmed') {
      // Refund credits if session was confirmed but then cancelled
      const requiredCredits = Math.ceil(session.duration / 60);
      await processCredits(session.student._id, requiredCredits, 'session_cancellation', `Session cancellation refund: ${session.skill}`, session._id);
    } else if (status === 'completed' && session.status === 'confirmed') {
      // Award credits to teacher when session is completed
      const earnedCredits = Math.ceil(session.duration / 60);
      await processCredits(session.teacher._id, earnedCredits, 'session_completion', `Session teaching: ${session.skill}`, session._id);
    }

    // Update session
    session.status = status;
    if (reason) session.cancellationReason = reason;
    if (status === 'completed') session.completedAt = new Date();

    await session.save();

    // Emit notifications
    const io = req.app.get('io');
    if (io) {
      const notificationData = {
        sessionId: session._id,
        status,
        skill: session.skill,
        scheduledFor: session.scheduledFor,
        reason
      };

      if (currentUserId === session.teacher._id.toString()) {
        io.to(session.student._id.toString()).emit('sessionStatusUpdate', {
          ...notificationData,
          updatedBy: 'teacher'
        });
      } else {
        io.to(session.teacher._id.toString()).emit('sessionStatusUpdate', {
          ...notificationData,
          updatedBy: 'student'
        });
      }
    }

    res.json({ session });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get available time slots for a teacher
const getAvailableSlots = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { date, duration = 60 } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const selectedDate = parseISO(date);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(9, 0, 0, 0); // 9 AM
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(21, 0, 0, 0); // 9 PM

    // Get existing sessions for the day
    const existingSessions = await Session.find({
      teacher: teacherId,
      scheduledFor: {
        $gte: startOfDay,
        $lt: addHours(endOfDay, 24)
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate available slots (every 30 minutes from 9 AM to 9 PM)
    const slots = [];
    let currentSlot = new Date(startOfDay);

    while (currentSlot < endOfDay) {
      const slotEnd = addHours(currentSlot, duration / 60);
      
      // Check if slot conflicts with existing sessions
      const hasConflict = existingSessions.some(session => {
        const sessionStart = new Date(session.scheduledFor);
        const sessionEnd = addHours(sessionStart, session.duration / 60);
        
        return (currentSlot < sessionEnd && slotEnd > sessionStart);
      });

      if (!hasConflict && isAfter(currentSlot, new Date())) {
        slots.push({
          start: currentSlot.toISOString(),
          end: slotEnd.toISOString(),
          available: true
        });
      }

      currentSlot = addHours(currentSlot, 0.5); // 30-minute intervals
    }

    res.json({ slots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Rate a completed session
const rateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, review } = req.body;
    const currentUserId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const session = await Session.findById(sessionId)
      .populate('teacher', 'name rating totalRatings')
      .populate('student', 'name');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Can only rate completed sessions' });
    }

    if (session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Only student can rate the session' });
    }

    if (session.rating) {
      return res.status(400).json({ error: 'Session already rated' });
    }

    // Update session with rating
    session.rating = rating;
    session.review = review;
    await session.save();

    // Update teacher's overall rating
    const teacher = session.teacher;
    const newTotalRatings = teacher.totalRatings + 1;
    const newRating = ((teacher.rating * teacher.totalRatings) + rating) / newTotalRatings;

    await User.findByIdAndUpdate(teacher._id, {
      rating: Math.round(newRating * 10) / 10,
      totalRatings: newTotalRatings
    });

    res.json({ 
      success: true, 
      session: {
        id: session._id,
        rating: session.rating,
        review: session.review
      }
    });
  } catch (error) {
    console.error('Error rating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSessions,
  getUserSessions: getSessions, // Alias for backward compatibility
  getSession,
  createSession,
  updateSession: updateSessionStatus, // Alias for consistency
  deleteSession: async (req, res) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;

      const session = await Session.findById(id);
      if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }

      // Only allow deletion by participants and only if not completed
      if (session.teacher.toString() !== currentUserId && session.student.toString() !== currentUserId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      if (session.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Cannot delete completed sessions' });
      }

      await Session.findByIdAndDelete(id);
      res.json({ success: true, message: 'Session deleted successfully' });
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  updateSessionStatus,
  getAvailableSlots,
  rateSession
};
