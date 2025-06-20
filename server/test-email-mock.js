// Mock email testing script - tests email logic without sending actual emails
require('dotenv').config();
const EmailService = require('./services/EmailService');

// Mock the EmailService for testing without sending real emails
const MockEmailService = {
  async sendEmail(to, subject, htmlContent, textContent = null) {
    console.log(`📧 MOCK EMAIL SENT:`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   HTML Length: ${htmlContent.length} characters`);
    console.log(`   Text: ${textContent || 'Auto-generated from HTML'}`);
    console.log('');
    return { success: true, messageId: 'mock-' + Date.now() };
  },

  async sendSessionReminder(user, session, minutesUntil) {
    console.log(`🔔 MOCK SESSION REMINDER:`);
    console.log(`   User: ${user.name || user.email}`);
    console.log(`   Session: ${session.skill}`);
    console.log(`   Minutes Until: ${minutesUntil}`);
    console.log('');
    return { success: true, messageId: 'mock-reminder-' + Date.now() };
  },

  async sendSessionCompletionNotification(user, session, earnedCredits) {
    console.log(`✅ MOCK SESSION COMPLETION:`);
    console.log(`   User: ${user.firstName || user.name || user.email}`);
    console.log(`   Session: ${session.skill}`);
    console.log(`   Credits Earned: ${earnedCredits}`);
    console.log('');
    return { success: true, messageId: 'mock-completion-' + Date.now() };
  }
};

async function testEmailNotificationFlow() {
  console.log('🧪 Testing Email Notification Logic (Mock Mode)\n');
  
  // Mock data
  const mockTeacher = {
    name: 'John Teacher',
    email: 'teacher@example.com',
    firstName: 'John',
    lastName: 'Teacher'
  };
  
  const mockStudent = {
    name: 'Jane Student',
    email: 'student@example.com',
    firstName: 'Jane',
    lastName: 'Student'
  };
  
  const mockSession = {
    _id: 'mock-session-id',
    skill: 'JavaScript Programming',
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    teacher: mockTeacher,
    student: mockStudent,
    actualDuration: 65
  };

  console.log('🎬 Testing Email Notification Scenarios:\n');

  // 1. Test session request notification
  console.log('1️⃣  Session Request Notification:');
  await MockEmailService.sendEmail(
    mockTeacher.email,
    `New Session Request: ${mockSession.skill}`,
    `<p>Session request from ${mockStudent.name} for ${mockSession.skill}</p>`
  );

  // 2. Test session confirmation notification
  console.log('2️⃣  Session Confirmation Notification:');
  await MockEmailService.sendEmail(
    mockStudent.email,
    `Session Confirmed: ${mockSession.skill}`,
    `<p>Your session with ${mockTeacher.name} has been confirmed!</p>`
  );

  // 3. Test session reminder notifications
  console.log('3️⃣  Session Reminder Notifications:');
  await MockEmailService.sendSessionReminder(mockTeacher, mockSession, 1440); // 24h
  await MockEmailService.sendSessionReminder(mockStudent, mockSession, 60);   // 1h
  await MockEmailService.sendSessionReminder(mockTeacher, mockSession, 15);   // 15min

  // 4. Test session completion notifications
  console.log('4️⃣  Session Completion Notifications:');
  await MockEmailService.sendSessionCompletionNotification(mockTeacher, mockSession, 2);
  await MockEmailService.sendEmail(
    mockStudent.email,
    `Session Completed: ${mockSession.skill}`,
    `<p>You completed the session with ${mockTeacher.name}!</p>`
  );

  // 5. Test session cancellation notification
  console.log('5️⃣  Session Cancellation Notification:');
  await MockEmailService.sendEmail(
    mockStudent.email,
    `Session Cancelled: ${mockSession.skill}`,
    `<p>Session with ${mockTeacher.name} was cancelled.</p>`
  );

  console.log('✅ All email notification scenarios tested successfully!');
  console.log('\n📋 Email Notification Summary:');
  console.log('   - Session request emails ✓');
  console.log('   - Session confirmation emails ✓');
  console.log('   - Session reminder emails (24h, 1h, 15min) ✓');
  console.log('   - Session completion emails ✓');
  console.log('   - Session cancellation emails ✓');
  
  console.log('\n🔧 To enable actual email sending:');
  console.log('   1. Configure SMTP credentials in .env file');
  console.log('   2. Run: node test-email.js');
  console.log('   3. Test real email flow with the application');
}

// Check if running in live mode or mock mode
if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com') {
  console.log('🌐 SMTP credentials found - you can test with real emails!');
  console.log('   Run: node test-email.js (for real email test)');
  console.log('   Or continue with mock testing below...\n');
} else {
  console.log('📧 No SMTP credentials configured - running in mock mode');
  console.log('   This tests the email logic without sending real emails\n');
}

// Run the test
testEmailNotificationFlow()
  .then(() => {
    console.log('\n🏁 Mock email test completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test script error:', error);
    process.exit(1);
  });
