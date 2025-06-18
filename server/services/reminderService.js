const Session = require('../models/Session');
const User = require('../models/User');
const cron = require('node-cron');

class ReminderService {
  constructor(io) {
    this.io = io;
    this.initializeCronJobs();
  }

  initializeCronJobs() {
    // Run every 5 minutes to check for reminders
    cron.schedule('*/5 * * * *', () => {
      this.checkAndSendReminders();
    });

    console.log('📅 Reminder service initialized with cron jobs');
  }

  async checkAndSendReminders() {
    try {
      const now = new Date();
      
      // Find confirmed sessions that need reminders
      const sessions = await Session.find({
        status: 'confirmed',
        scheduledFor: {
          $gte: now,
          $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) // Next 24 hours
        }
      })
      .populate('teacher', 'name email profilePicture')
      .populate('student', 'name email profilePicture');

      for (const session of sessions) {
        await this.processSessionReminders(session, now);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  async processSessionReminders(session, now) {
    const scheduledTime = new Date(session.scheduledFor);
    const timeDiff = scheduledTime.getTime() - now.getTime();
    
    // Calculate time differences in milliseconds
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;
    const fifteenMinutes = 15 * 60 * 1000;

    const sentReminders = session.remindersSent || [];
    
    try {
      // 24-hour reminder
      if (timeDiff <= twentyFourHours && timeDiff > oneHour) {
        if (!sentReminders.some(r => r.type === '24h')) {
          await this.sendReminder(session, '24h', 'in 24 hours');
        }
      }
      
      // 1-hour reminder
      if (timeDiff <= oneHour && timeDiff > fifteenMinutes) {
        if (!sentReminders.some(r => r.type === '1h')) {
          await this.sendReminder(session, '1h', 'in 1 hour');
        }
      }
      
      // 15-minute reminder
      if (timeDiff <= fifteenMinutes && timeDiff > 0) {
        if (!sentReminders.some(r => r.type === '15min')) {
          await this.sendReminder(session, '15min', 'in 15 minutes');
        }
      }
    } catch (error) {
      console.error(`Error processing reminders for session ${session._id}:`, error);
    }
  }

  async sendReminder(session, reminderType, timeText) {
    try {
      // Send real-time notifications
      const reminderData = {
        type: 'session_reminder',
        sessionId: session._id,
        skill: session.skill,
        scheduledFor: session.scheduledFor,
        timeUntil: timeText,
        participants: {
          teacher: session.teacher,
          student: session.student
        }
      };

      // Emit to both participants
      if (this.io) {
        this.io.to(`user:${session.teacher._id}`).emit('session:reminder', {
          ...reminderData,
          role: 'teacher',
          otherParticipant: session.student
        });

        this.io.to(`user:${session.student._id}`).emit('session:reminder', {
          ...reminderData,
          role: 'student',
          otherParticipant: session.teacher
        });
      }

      // Update session with sent reminder
      await Session.findByIdAndUpdate(session._id, {
        $push: {
          remindersSent: {
            type: reminderType,
            sentAt: new Date()
          }
        }
      });

      console.log(`📬 Sent ${reminderType} reminder for session ${session._id} (${session.skill})`);
      
      // In a production environment, you would also send:
      // - Email notifications
      // - Push notifications
      // - SMS reminders (optional)
      
    } catch (error) {
      console.error(`Error sending ${reminderType} reminder:`, error);
    }
  }

  // Manual reminder trigger (for testing or admin use)
  async sendManualReminder(sessionId, reminderType) {
    try {
      const session = await Session.findById(sessionId)
        .populate('teacher', 'name email profilePicture')
        .populate('student', 'name email profilePicture');

      if (!session) {
        throw new Error('Session not found');
      }

      await this.sendReminder(session, reminderType, 'now (manual trigger)');
      return { success: true, message: 'Reminder sent successfully' };
    } catch (error) {
      console.error('Error sending manual reminder:', error);
      throw error;
    }
  }

  // Get reminder statistics
  async getReminderStats() {
    try {
      const stats = await Session.aggregate([
        {
          $match: {
            status: 'confirmed',
            scheduledFor: { $gte: new Date() }
          }
        },
        {
          $project: {
            reminderCount: { $size: { $ifNull: ['$remindersSent', []] } },
            scheduledFor: 1,
            skill: 1
          }
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalReminders: { $sum: '$reminderCount' },
            avgRemindersPerSession: { $avg: '$reminderCount' }
          }
        }
      ]);

      return stats[0] || {
        totalSessions: 0,
        totalReminders: 0,
        avgRemindersPerSession: 0
      };
    } catch (error) {
      console.error('Error getting reminder stats:', error);
      return null;
    }
  }
}

module.exports = ReminderService;
