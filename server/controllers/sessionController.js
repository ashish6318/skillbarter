const Session = require('../models/Session');
const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');
const { paginateWithOffset, paginateWithCursor } = require('../utils/pagination');
const { processCredits } = require('../utils/helpers');
const { isBefore, parseISO } = require('date-fns');
const EmailService = require('../services/EmailService');

// Custom function to add hours to a date
const addHours = (date, hours) => {
  const result = new Date(date);
  result.setTime(result.getTime() + (hours * 60 * 60 * 1000));
  return result;
};

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

    await session.save();    await session.populate('teacher', 'name profilePicture skillsOffered rating email');
    await session.populate('student', 'name profilePicture email');

    // Send email notification to teacher about new session request
    try {
      if (session.teacher.email) {
        await EmailService.sendEmail(
          session.teacher.email,
          `New Session Request: ${skill}`,
          `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">New Session Request 📚</h2>
              
              <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="color: #4f46e5; margin-bottom: 10px;">${skill}</h3>
                <p><strong>Student:</strong> ${session.student.name}</p>
                <p><strong>Scheduled For:</strong> ${new Date(session.scheduledFor).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${duration} minutes</p>
                ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
              </div>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.FRONTEND_URL}/sessions" 
                   style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Review Request
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center;">
                Log in to your SkillBarter account to accept or decline this session request.
              </p>
            </div>
          </div>
          `
        );
        console.log(`Session request email sent to teacher: ${session.teacher.email}`);
      }
    } catch (emailError) {
      console.error('Failed to send session request email:', emailError);
      // Don't fail the session creation if email fails
    }

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
  try {    const { id } = req.params;
    const { status, reason } = req.body;
    const currentUserId = req.user.id;

    const session = await Session.findById(id)
      .populate('teacher', 'name profilePicture email')
      .populate('student', 'name profilePicture email');

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
    }    // Handle status transitions
    if (status === 'confirmed' && session.status === 'pending') {
      // Deduct credits from student when session is confirmed
      const requiredCredits = Math.ceil(session.duration / 60);
      await processCredits(session.student._id, -requiredCredits, 'session_booking', `Session booking: ${session.skill}`, session._id);
      
      // Get updated user credit balance for notification
      const updatedStudent = await User.findById(session.student._id).select('credits');
      
      // Emit credit deduction notification to student
      if (io) {
        io.to(session.student._id.toString()).emit('creditDeduction', {
          sessionId: session._id,
          skill: session.skill,
          creditsDeducted: requiredCredits,
          remainingCredits: updatedStudent.credits,
          scheduledFor: session.scheduledFor
        });
      }
    } else if (status === 'cancelled' && session.status === 'confirmed') {
      // Refund credits if session was confirmed but then cancelled
      const requiredCredits = Math.ceil(session.duration / 60);
      await processCredits(session.student._id, requiredCredits, 'session_cancellation', `Session cancellation refund: ${session.skill}`, session._id);    } else if (status === 'completed' && session.status === 'confirmed') {
      // Award credits to teacher when session is completed
      const earnedCredits = Math.ceil(session.duration / 60);
      await processCredits(session.teacher._id, earnedCredits, 'session_completion', `Session teaching: ${session.skill}`, session._id);
      
      // Update total hours for both participants (using session duration as actualDuration)
      const sessionHours = Math.ceil(session.duration / 60); // Round up to minimum 1 hour
      
      // Update teacher's total hours taught
      await User.findByIdAndUpdate(session.teacher._id, {
        $inc: { totalHoursTaught: sessionHours }
      });
      
      // Update student's total hours learned
      await User.findByIdAndUpdate(session.student._id, {
        $inc: { totalHoursLearned: sessionHours }
      });
      
      console.log(`Updated hours via status update: Teacher +${sessionHours}h taught, Student +${sessionHours}h learned`);
    }    // Update session
    session.status = status;
    if (reason) session.cancellationReason = reason;
    if (status === 'completed') session.completedAt = new Date();

    await session.save();

    // Send email notifications for status changes
    try {
      if (status === 'confirmed' && session.teacher.email && session.student.email) {
        // Notify student that session was confirmed
        await EmailService.sendEmail(
          session.student.email,
          `Session Confirmed: ${session.skill}`,
          `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">Session Confirmed! ✅</h2>
              
              <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="color: #10b981; margin-bottom: 10px;">${session.skill}</h3>
                <p><strong>Teacher:</strong> ${session.teacher.name}</p>
                <p><strong>Scheduled For:</strong> ${new Date(session.scheduledFor).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${session.duration} minutes</p>
              </div>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.FRONTEND_URL}/sessions" 
                   style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Session Details
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center;">
                Your credits have been deducted. Get ready for your learning session!
              </p>
            </div>
          </div>
          `
        );
        console.log(`Session confirmation email sent to student: ${session.student.email}`);
        
      } else if (status === 'cancelled') {
        // Notify the other participant about cancellation
        const recipient = currentUserId === session.teacher._id.toString() ? session.student : session.teacher;
        const cancelledBy = currentUserId === session.teacher._id.toString() ? 'teacher' : 'student';
        
        if (recipient.email) {
          await EmailService.sendEmail(
            recipient.email,
            `Session Cancelled: ${session.skill}`,
            `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                <h2 style="color: #333; margin-bottom: 20px;">Session Cancelled 🚫</h2>
                
                <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                  <h3 style="color: #ef4444; margin-bottom: 10px;">${session.skill}</h3>
                  <p><strong>Cancelled by:</strong> ${cancelledBy === 'teacher' ? session.teacher.name : session.student.name}</p>
                  <p><strong>Original time:</strong> ${new Date(session.scheduledFor).toLocaleString()}</p>
                  ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_URL}/sessions" 
                     style="background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View All Sessions
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; text-align: center;">
                  ${cancelledBy === 'student' ? 'Your credits have been refunded.' : 'We apologize for the inconvenience.'}
                </p>
              </div>
            </div>
            `
          );
          console.log(`Session cancellation email sent to ${recipient.email}`);
        }
      }
    } catch (emailError) {
      console.error('Failed to send session status email:', emailError);
      // Don't fail the status update if email fails
    }    // Emit notifications
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
        // Teacher is updating - notify student
        io.to(session.student._id.toString()).emit('sessionStatusUpdate', {
          ...notificationData,
          updatedBy: 'teacher'
        });

        // Special notification for session acceptance
        if (status === 'confirmed') {
          io.to(session.student._id.toString()).emit('sessionAccepted', {
            sessionId: session._id,
            skill: session.skill,
            teacherName: session.teacher.name,
            scheduledFor: session.scheduledFor,
            duration: session.duration,
            creditsDeducted: Math.ceil(session.duration / 60)
          });
        }
      } else {
        // Student is updating - notify teacher
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
    }    const selectedDate = new Date(date + 'T12:00:00.000Z'); // Use noon UTC to avoid timezone issues
    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    
    // Generate available time slots for the selected date
    const currentTime = new Date();
    const isToday = selectedDate.toDateString() === currentTime.toDateString();
    
    let startHour, endHour;
    
    if (isToday) {
      // For today: start from current hour
      startHour = Math.max(0, currentTime.getHours());
      endHour = 23;
    } else {
      // For future dates: normal business hours
      startHour = 6;  // 6 AM
      endHour = 23;   // 11 PM
    }
    
    startOfDay.setHours(startHour, 0, 0, 0);
    endOfDay.setHours(endHour, 0, 0, 0);

    console.log('Date range:', { selectedDate, startOfDay, endOfDay });
    console.log('Current time:', currentTime);
    console.log('Is today:', isToday);
    console.log('Available hours:', startHour, 'to', endHour);

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
      
      // Only include future slots
      const isInFuture = currentSlot.getTime() > (now.getTime() + 5 * 60 * 1000); // 5 minutes buffer

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
    const currentUserId = req.user.id;    console.log('Start session request:', {
      sessionId: id,
      userId: currentUserId
    });

    const session = await Session.findById(id)
      .populate('teacher', 'firstName lastName profilePicture')
      .populate('student', 'firstName lastName profilePicture');

    if (!session) {
      console.log('Session not found:', id);
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('Session found:', {
      id: session._id,
      status: session.status,
      scheduledFor: session.scheduledFor,
      teacher: session.teacher._id,
      student: session.student._id
    });

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      console.log('Access denied - user not part of session');
      return res.status(403).json({ error: 'Access denied' });
    }

    if (session.status !== 'confirmed') {
      console.log('Session not confirmed. Current status:', session.status);
      return res.status(400).json({ error: 'Session must be confirmed to start' });
    }

    // Check if it's time to start (within 15 minutes of scheduled time)
    const now = new Date();
    const scheduledTime = new Date(session.scheduledFor);
    const timeDiff = Math.abs(now - scheduledTime) / (1000 * 60); // difference in minutes

    console.log('Time check:', {
      now: now.toISOString(),
      scheduledTime: scheduledTime.toISOString(),
      timeDiff: timeDiff,
      canStart: timeDiff <= 15 || now >= scheduledTime
    });

    if (timeDiff > 15 && now < scheduledTime) {
      console.log('Session cannot be started yet - too early');
      return res.status(400).json({ error: 'Session can only be started within 15 minutes of scheduled time' });
    }    // Generate room details if not already generated
    if (!session.roomId) {
      // Use a simpler room ID format that's more likely to work with Jitsi
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 8);
      const roomId = `SkillBarter${session._id.toString().slice(-6)}${randomPart}`;
      const roomPassword = Math.random().toString(36).substring(2, 15);
      const meetingUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/session/${session._id}/room`;

      session.roomId = roomId;
      session.roomPassword = roomPassword;
      session.meetingUrl = meetingUrl;
      
      console.log('Generated room details:', {
        roomId,
        roomPassword,
        meetingUrl
      });
    } else {
      console.log('Using existing room details:', {
        roomId: session.roomId,
        meetingUrl: session.meetingUrl
      });
    }

    // Update session status and start time
    session.status = 'in_progress';
    session.startedAt = new Date();
    await session.save();

    console.log('Session started successfully');

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      const participantId = currentUserId === session.teacher._id.toString() 
        ? session.student._id.toString() 
        : session.teacher._id.toString();
      
      console.log('Emitting session:started event to participant:', participantId);
      
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
    const currentUserId = req.user.id;    console.log('End session request:', {
      sessionId: id,
      userId: currentUserId,
      requestBody: req.body
    });

    const session = await Session.findById(id)
      .populate('teacher', 'firstName lastName profilePicture')
      .populate('student', 'firstName lastName profilePicture');

    if (!session) {
      console.log('Session not found:', id);
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('Session found:', {
      id: session._id,
      status: session.status,
      teacher: session.teacher._id,
      student: session.student._id
    });

    // Check if user is part of this session
    if (session.teacher._id.toString() !== currentUserId && session.student._id.toString() !== currentUserId) {
      console.log('Access denied - user not part of session');
      return res.status(403).json({ error: 'Access denied' });
    }

    if (session.status !== 'in_progress') {
      console.log('Session not in progress. Current status:', session.status);
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

    console.log('Session updated to completed');

    // Process credits - award to teacher based on actual duration
    const earnedCredits = Math.ceil(session.actualDuration / 60);
    console.log('Processing credits:', { earnedCredits, teacherId: session.teacher._id });
    
    await processCredits(
      session.teacher._id, 
      earnedCredits, 
      'session_completion', 
      `Session teaching: ${session.skill}`,
      session._id
    );    console.log('Credits processed successfully');

    // Update total hours for both participants
    const actualHours = Math.ceil(session.actualDuration / 60); // Round up to minimum 1 hour
    
    // Update teacher's total hours taught
    await User.findByIdAndUpdate(session.teacher._id, {
      $inc: { totalHoursTaught: actualHours }
    });
    
    // Update student's total hours learned
    await User.findByIdAndUpdate(session.student._id, {
      $inc: { totalHoursLearned: actualHours }
    });
      console.log(`Updated hours: Teacher +${actualHours}h taught, Student +${actualHours}h learned`);

    // Send email notifications to both participants
    try {
      // Populate email addresses for notifications
      const teacher = await User.findById(session.teacher._id).select('email firstName lastName');
      const student = await User.findById(session.student._id).select('email firstName lastName');
      
      if (teacher && teacher.email) {
        await EmailService.sendSessionCompletionNotification(teacher, session, earnedCredits);
        console.log(`Session completion email sent to teacher: ${teacher.email}`);
      }
      
      if (student && student.email) {
        // Create a notification for the student as well 
        await EmailService.sendEmail(
          student.email,
          `Session Completed: ${session.skill}`,
          `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333; margin-bottom: 20px;">Session Completed! 🎓</h2>
              
              <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h3 style="color: #4f46e5; margin-bottom: 10px;">Great job learning ${session.skill}!</h3>
                <p><strong>Session Duration:</strong> ${session.actualDuration} minutes</p>
                <p><strong>Teacher:</strong> ${teacher?.firstName || 'Unknown'} ${teacher?.lastName || ''}</p>
                <p><strong>Completed:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.FRONTEND_URL}/sessions" 
                   style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Session History
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center;">
                Keep learning and exploring new skills on SkillBarter!
              </p>
            </div>
          </div>
          `
        );
        console.log(`Session completion email sent to student: ${student.email}`);
      }
    } catch (emailError) {
      console.error('Failed to send session completion emails:', emailError);
      // Don't fail the session completion if email fails
    }

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

    // Debug logging
    console.log('Review submission data:', {
      sessionId: id,
      userId: currentUserId,
      rating,
      ratingType: typeof rating,
      feedback,
      wouldRecommend,
      fullBody: req.body
    });

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

    // Validate rating (convert to number if needed)
    const numericRating = Number(rating);
    console.log('Converted rating:', numericRating, 'isNaN:', isNaN(numericRating));
    
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }    // Update session with review
    session.review = {
      rating: numericRating,
      feedback,
      wouldRecommend: wouldRecommend || false,
      reviewedAt: new Date()
    };

    await session.save();    // Update teacher's overall rating
    const teacher = session.teacher;
    const currentRating = teacher.rating || 0;
    const currentTotalRatings = teacher.totalRatings || 0;
    const newTotalRatings = currentTotalRatings + 1;
    const newRating = ((currentRating * currentTotalRatings) + numericRating) / newTotalRatings;

    console.log('Rating calculation:', {
      currentRating,
      currentTotalRatings,
      numericRating,
      newTotalRatings,
      newRating,
      isNaN: isNaN(newRating)
    });

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
      .populate('teacher', 'firstName lastName profilePicture')
      .populate('student', 'firstName lastName profilePicture');

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
            name: `${session.teacher.firstName} ${session.teacher.lastName}`,
            profilePicture: session.teacher.profilePicture
          },
          student: {
            id: session.student._id,
            name: `${session.student.firstName} ${session.student.lastName}`,
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
