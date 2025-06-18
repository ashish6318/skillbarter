// Email notification service for the backend
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configure email transporter
    // In production, use environment variables for email configuration
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'SkillBarter <noreply@skillbarter.com>',
        to,
        subject,
        html: htmlContent,
        text: textContent || this.stripHtml(htmlContent)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Session reminder email
  async sendSessionReminder(user, session, minutesUntil) {
    const subject = `Session Reminder: ${session.skill} in ${minutesUntil} minutes`;
    
    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Session Reminder</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #4f46e5; margin-bottom: 10px;">${session.skill}</h3>
            <p><strong>Time:</strong> ${new Date(session.scheduledFor).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${session.duration} minutes</p>
            <p><strong>Role:</strong> ${session.role === 'teacher' ? 'Teaching' : 'Learning'}</p>
            <p><strong>Participant:</strong> ${session.otherParticipant?.name || 'Unknown'}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/session/${session._id}/room" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Join Session
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This session will start in ${minutesUntil} minutes. Please be on time!
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, htmlContent);
  }

  // Credit transaction notification
  async sendCreditNotification(user, transaction) {
    const isEarned = ['purchase', 'session_completion', 'bonus', 'refund', 'transfer_in'].includes(transaction.type);
    const subject = `Credit ${isEarned ? 'Received' : 'Spent'}: ${transaction.amount} credits`;
    
    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Credit Transaction</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <span style="font-size: 24px; margin-right: 10px;">${isEarned ? '💰' : '💸'}</span>
              <h3 style="color: ${isEarned ? '#10b981' : '#ef4444'}; margin: 0;">
                ${isEarned ? '+' : '-'}${transaction.amount} Credits
              </h3>
            </div>
            
            <p><strong>Transaction Type:</strong> ${transaction.type.replace(/_/g, ' ').toUpperCase()}</p>
            <p><strong>Description:</strong> ${transaction.description}</p>
            <p><strong>Date:</strong> ${new Date(transaction.createdAt).toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/credits" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Credit History
            </a>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, htmlContent);
  }

  // Session completion notification
  async sendSessionCompletionNotification(user, session, earnedCredits) {
    const subject = `Session Completed: Earned ${earnedCredits} credits`;
    
    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Session Completed! 🎉</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #10b981; margin-bottom: 10px;">Great job teaching ${session.skill}!</h3>
            <p><strong>Credits Earned:</strong> ${earnedCredits}</p>
            <p><strong>Session Duration:</strong> ${session.duration} minutes</p>
            <p><strong>Student:</strong> ${session.student?.name || 'Unknown'}</p>
            <p><strong>Completed:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/sessions" 
               style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Session History
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Keep up the great work! Your expertise is helping others learn new skills.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, htmlContent);
  }

  // Weekly activity summary
  async sendWeeklyActivitySummary(user, stats) {
    const subject = 'Your Weekly SkillBarter Summary';
    
    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Weekly Activity Summary</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #4f46e5; margin-bottom: 15px;">This Week's Highlights</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
              <div style="text-align: center; padding: 15px; background-color: #f0f9ff; border-radius: 6px;">
                <div style="font-size: 24px; font-weight: bold; color: #0369a1;">${stats.sessionsCompleted || 0}</div>
                <div style="color: #6b7280; font-size: 14px;">Sessions</div>
              </div>
              <div style="text-align: center; padding: 15px; background-color: #f0fdf4; border-radius: 6px;">
                <div style="font-size: 24px; font-weight: bold; color: #166534;">${stats.creditsEarned || 0}</div>
                <div style="color: #6b7280; font-size: 14px;">Credits Earned</div>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
              <p><strong>Skills Taught:</strong> ${stats.skillsTaught?.join(', ') || 'None'}</p>
              <p><strong>Skills Learned:</strong> ${stats.skillsLearned?.join(', ') || 'None'}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, htmlContent);
  }
}

module.exports = new EmailService();
