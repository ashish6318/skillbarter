const Session = require('../models/Session');
const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');
const { paginateWithOffset, paginateWithCursor } = require('../utils/pagination');
const { processCredits } = require('../utils/helpers');
const { addHours, isBefore, parseISO } = require('date-fns');

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
    }    const populate = [
      { path: 'teacher', select: 'name profilePicture skillsOffered rating' },
      { path: 'student', select: 'name profilePicture' }
    ];

    let result;
    if (cursor) {
      result = await paginateWithCursor(
        Session,
        query,
        { 
          limit: parseInt(limit),
          cursor,
          sortField: 'createdAt',
          sortOrder: -1,
          populate: populate
        }
      );    } else {
      const page = parseInt(req.query.page) || 1;
      
      result = await paginateWithOffset(Session,
        query,
        { 
          page,
          limit: parseInt(limit),
          sortField: 'createdAt',
          sortOrder: -1,
          populate: populate
        }
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
    const currentUserId = req.user.id;    const session = await Session.findById(sessionId)
      .populate('teacher', 'name profilePicture skillsOffered rating')
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
    console.log('Creating session with data:', req.body);
    
    const { teacher, skill, scheduledFor, duration, message } = req.body;
    const student = req.user.id;

    console.log('Session data:', { teacher, skill, scheduledFor, duration, message, student });

    // Validate teacher exists and has the skill
    const teacherUser = await User.findById(teacher);
    if (!teacherUser) {
      console.log('Teacher not found:', teacher);
      return res.status(404).json({ error: 'Teacher not found' });
    }

    console.log('Teacher found:', { 
      id: teacherUser._id, 
      name: teacherUser.name, 
      skillsOffered: teacherUser.skillsOffered,
      allFields: Object.keys(teacherUser.toObject ? teacherUser.toObject() : teacherUser)
    });

    if (!teacherUser.skillsOffered || !Array.isArray(teacherUser.skillsOffered) || 
        !teacherUser.skillsOffered.some(skillObj => skillObj.skill === skill)) {
      console.log('Skill not found:', { skill, teacherSkills: teacherUser.skillsOffered });
      return res.status(400).json({ error: 'Teacher does not offer this skill' });
    }

    // Check if scheduled time is in the future
    const scheduledDate = parseISO(scheduledFor);
    console.log('Scheduled date check:', { scheduledFor, scheduledDate, now: new Date() });
    
    if (isBefore(scheduledDate, new Date())) {
      console.log('Scheduled time is in the past');
      return res.status(400).json({ error: 'Session must be scheduled for a future time' });
    }

    // Check student has enough credits
    const studentUser = await User.findById(student);
    const requiredCredits = Math.ceil(duration / 60); // 1 credit per hour
    
    console.log('Credit check:', { requiredCredits, availableCredits: studentUser.credits });
    
    if (studentUser.credits < requiredCredits) {
      console.log('Insufficient credits');
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

    await session.save();    await session.populate('teacher', 'name profilePicture skillsOffered rating');
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
    const { id } = req.params;
    const { status, reason } = req.body;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
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

    console.log('Available slots request:', { teacherId, date, duration });

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    if (!teacherId || teacherId === 'undefined') {
      return res.status(400).json({ error: 'Valid teacher ID is required' });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const selectedDate = new Date(date + 'T12:00:00.000Z'); // Use noon UTC to avoid timezone issues
    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(9, 0, 0, 0); // 9 AM UTC
    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(21, 0, 0, 0); // 9 PM UTC

    console.log('Date range:', { selectedDate, startOfDay, endOfDay });
    console.log('Current time:', new Date());

    // Get existing sessions for the day
    const existingSessions = await Session.find({
      teacher: teacherId,
      scheduledFor: {
        $gte: startOfDay,
        $lt: new Date(endOfDay.getTime() + 24 * 60 * 60 * 1000) // next day
      },
      status: { $in: ['pending', 'confirmed'] }
    });    console.log('Existing sessions:', existingSessions.length);

    // Generate available slots (every 30 minutes from 9 AM to 9 PM)
    const slots = [];
    
    let currentSlot = new Date(startOfDay);
    const now = new Date();

    console.log('Starting slot generation from:', currentSlot.toISOString());
    console.log('Until:', endOfDay.toISOString());
    console.log('Current time:', now.toISOString());

    while (currentSlot < endOfDay) {
      const slotEnd = addHours(currentSlot, duration / 60);
      
      // Check if slot conflicts with existing sessions
      const hasConflict = existingSessions.some(session => {
        const sessionStart = new Date(session.scheduledFor);
        const sessionEnd = addHours(sessionStart, session.duration / 60);
        
        return (currentSlot < sessionEnd && slotEnd > sessionStart);
      });

      // Only include future slots (at least 30 minutes from now to allow booking time)
      const isInFuture = currentSlot.getTime() > (now.getTime() + 30 * 60 * 1000);

      if (slots.length < 5) { // Only log first 5 slots to avoid spam
        console.log(`Slot ${currentSlot.toISOString()}: conflict=${hasConflict}, future=${isInFuture}`);
      }

      if (!hasConflict && isInFuture) {
        slots.push({
          start: currentSlot.toISOString(),
          end: slotEnd.toISOString(),
          available: true
        });
      }

      // Move to next slot (30-minute intervals)
      currentSlot = new Date(currentSlot.getTime() + 30 * 60 * 1000);
    }

    console.log('Generated slots:', slots.length);
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

// Start session (generate room)
const startSession = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
      .populate('teacher', 'name profilePicture')
      .populate('student', 'name profilePicture');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (session.status !== 'confirmed') {
      return res.status(400).json({ error: 'Session must be confirmed to start' });
    }

    // Check if it's time to start (within 15 minutes of scheduled time)
    const now = new Date();
    const scheduledTime = new Date(session.scheduledFor);
    const timeDiff = Math.abs(now - scheduledTime) / (1000 * 60); // difference in minutes

    if (timeDiff > 15 && now < scheduledTime) {
      return res.status(400).json({ error: 'Session can only be started within 15 minutes of scheduled time' });
    }

    // Generate room details if not already generated
    if (!session.roomId) {
      const roomId = `session_${session._id}_${Date.now()}`;
      const roomPassword = Math.random().toString(36).substring(2, 15);
      const meetingUrl = `${process.env.FRONTEND_URL}/session/${session._id}/room`;

      session.roomId = roomId;
      session.roomPassword = roomPassword;
      session.meetingUrl = meetingUrl;
    }

    // Update session status and start time
    session.status = 'in_progress';
    session.startedAt = new Date();
    await session.save();

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      const participantId = currentUserId === session.teacher._id.toString() 
        ? session.student._id.toString() 
        : session.teacher._id.toString();
      
      io.to(participantId).emit('session:started', {
        sessionId: session._id,
        roomId: session.roomId,
        meetingUrl: session.meetingUrl,
        startedBy: currentUserId === session.teacher._id.toString() ? 'teacher' : 'student'
      });
    }

    res.json({
      success: true,
      session: {
        id: session._id,
        status: session.status,
        roomId: session.roomId,
        meetingUrl: session.meetingUrl,
        startedAt: session.startedAt
      }
    });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// End session and process credits
const endSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualDuration, teacherNotes, studentNotes, sessionSummary } = req.body;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
      .populate('teacher', 'name profilePicture')
      .populate('student', 'name profilePicture');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (session.status !== 'in_progress') {
      return res.status(400).json({ error: 'Session must be in progress to end' });
    }

    // Update session details
    session.status = 'completed';
    session.endedAt = new Date();
    session.actualDuration = actualDuration || session.duration;
    
    if (teacherNotes) session.teacherNotes = teacherNotes;
    if (studentNotes) session.studentNotes = studentNotes;
    if (sessionSummary) session.sessionSummary = sessionSummary;

    await session.save();

    // Process credits - award to teacher based on actual duration
    const earnedCredits = Math.ceil(session.actualDuration / 60);
    await processCredits(
      session.teacher._id, 
      earnedCredits, 
      'session_completion', 
      `Session teaching: ${session.skill}`,
      session._id
    );

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      const participantId = currentUserId === session.teacher._id.toString() 
        ? session.student._id.toString() 
        : session.teacher._id.toString();
      
      io.to(participantId).emit('session:ended', {
        sessionId: session._id,
        endedBy: currentUserId === session.teacher._id.toString() ? 'teacher' : 'student',
        actualDuration: session.actualDuration
      });
    }

    res.json({
      success: true,
      session: {
        id: session._id,
        status: session.status,
        endedAt: session.endedAt,
        actualDuration: session.actualDuration,
        creditsEarned: earnedCredits
      }
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Submit session review (separate from rating)
const reviewSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback, wouldRecommend } = req.body;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
      .populate('teacher', 'name rating totalRatings')
      .populate('student', 'name');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed sessions' });
    }

    if (session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Only student can review the session' });
    }

    if (session.review && session.review.rating) {
      return res.status(400).json({ error: 'Session already reviewed' });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Update session with review
    session.review = {
      rating,
      feedback,
      wouldRecommend: wouldRecommend || false,
      reviewedAt: new Date()
    };

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
      review: session.review,
      teacherNewRating: Math.round(newRating * 10) / 10
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video room details
const getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
      .populate('teacher', 'name profilePicture')
      .populate('student', 'name profilePicture');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!session.roomId) {
      return res.status(400).json({ error: 'Session room not yet created' });
    }

    res.json({
      success: true,
      room: {
        roomId: session.roomId,
        roomPassword: session.roomPassword,
        meetingUrl: session.meetingUrl,
        status: session.status,
        participants: {
          teacher: {
            id: session.teacher._id,
            name: session.teacher.name,
            profilePicture: session.teacher.profilePicture
          },
          student: {
            id: session.student._id,
            name: session.student.name,
            profilePicture: session.student.profilePicture
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reschedule session
const rescheduleSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { newScheduledFor, reason } = req.body;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
      .populate('teacher', 'name profilePicture')
      .populate('student', 'name profilePicture');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Can only reschedule confirmed sessions
    if (session.status !== 'confirmed') {
      return res.status(400).json({ error: 'Only confirmed sessions can be rescheduled' });
    }

    // Check if new time is in the future
    const newTime = new Date(newScheduledFor);
    if (newTime <= new Date()) {
      return res.status(400).json({ error: 'New schedule time must be in the future' });
    }

    // Store original time for notification
    const originalTime = session.scheduledFor;

    // Update session
    session.scheduledFor = newTime;
    session.rescheduledAt = new Date();
    session.rescheduledBy = currentUserId;
    if (reason) session.rescheduleReason = reason;

    await session.save();

    // Emit notifications
    const io = req.app.get('io');
    if (io) {
      const notificationData = {
        sessionId: session._id,
        skill: session.skill,
        originalTime,
        newTime: newTime,
        reason,
        rescheduledBy: currentUserId === session.teacher._id.toString() ? 'teacher' : 'student'
      };

      const recipientId = currentUserId === session.teacher._id.toString() 
        ? session.student._id.toString() 
        : session.teacher._id.toString();

      io.to(recipientId).emit('session:rescheduled', notificationData);
    }

    res.json({
      success: true,
      session: {
        id: session._id,
        scheduledFor: session.scheduledFor,
        rescheduledAt: session.rescheduledAt,
        rescheduledBy: session.rescheduledBy,
        rescheduleReason: session.rescheduleReason
      }
    });
  } catch (error) {
    console.error('Error rescheduling session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cancel session (DELETE request)
const cancelSession = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
      .populate('teacher', 'name profilePicture')
      .populate('student', 'name profilePicture');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Can only cancel pending or confirmed sessions
    if (!['pending', 'confirmed'].includes(session.status)) {
      return res.status(400).json({ error: 'Cannot cancel session in current status' });
    }

    // Refund credits if session was confirmed
    if (session.status === 'confirmed') {
      const requiredCredits = Math.ceil(session.duration / 60);
      await processCredits(session.student._id, requiredCredits, 'session_cancellation', `Session cancellation refund: ${session.skill}`, session._id);
    }

    // Update session status
    session.status = 'cancelled';
    session.cancelledAt = new Date();
    session.cancelledBy = currentUserId;
    await session.save();

    // Emit notifications
    const io = req.app.get('io');
    if (io) {
      const recipientId = currentUserId === session.teacher._id.toString() 
        ? session.student._id.toString() 
        : session.teacher._id.toString();

      io.to(recipientId).emit('session:cancelled', {
        sessionId: session._id,
        skill: session.skill,
        scheduledFor: session.scheduledFor,
        cancelledBy: currentUserId === session.teacher._id.toString() ? 'teacher' : 'student'
      });
    }

    res.json({
      success: true,
      message: 'Session cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSessions,
  getSession,
  createSession,
  updateSessionStatus,
  cancelSession,
  startSession,
  endSession,
  reviewSession,
  rateSession: reviewSession, // Alias for backward compatibility
  getAvailableSlots,
  getRoomDetails,
  rescheduleSession,
  updateSession: updateSessionStatus, // Alias for consistency
};
