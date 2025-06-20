// Test script to verify email functionality
require('dotenv').config();
const EmailService = require('./services/EmailService');

async function testEmailService() {
  console.log('🧪 Testing Email Service Configuration...\n');
  
  // Display current configuration
  console.log('📧 Current SMTP Configuration:');
  console.log(`- Host: ${process.env.SMTP_HOST || 'NOT SET'}`);
  console.log(`- Port: ${process.env.SMTP_PORT || 'NOT SET'}`);
  console.log(`- User: ${process.env.SMTP_USER || 'NOT SET'}`);
  console.log(`- Pass: ${process.env.SMTP_PASS ? '***HIDDEN***' : 'NOT SET'}`);
  console.log('');
  
  // Check if configuration is set up
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('❌ Email configuration not properly set up!');
    console.log('📝 To set up email notifications:');
    console.log('1. Update .env file with your actual email credentials:');
    console.log('   SMTP_USER=your-actual-email@gmail.com');
    console.log('   SMTP_PASS=your-app-password');
    console.log('');
    console.log('2. For Gmail, you need an "App Password":');
    console.log('   - Enable 2FA on your Google account');
    console.log('   - Go to Google Account Settings > Security > App Passwords');
    console.log('   - Generate a new app password for this application');
    console.log('   - Use that password in SMTP_PASS (not your regular password)');
    console.log('');
    return;
  }
  
  // Test email sending
  const testEmail = process.env.SMTP_USER; // Send test email to configured email
  
  try {
    console.log(`📤 Sending test email to: ${testEmail}`);
    
    const result = await EmailService.sendEmail(
      testEmail,
      '🧪 SkillBarter Email Test',
      `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Email Service Test ✅</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p><strong>Congratulations!</strong> Your SkillBarter email service is working correctly.</p>
            <p><strong>Test sent at:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>SMTP Configuration:</strong></p>
            <ul>
              <li>Host: ${process.env.SMTP_HOST}</li>
              <li>Port: ${process.env.SMTP_PORT}</li>
              <li>User: ${process.env.SMTP_USER}</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This is an automated test email from your SkillBarter application.
          </p>
        </div>
      </div>
      `
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId}`);
      console.log('');
      console.log('🎉 Email notifications are working correctly!');
      console.log('📨 Check your inbox for the test email.');
    } else {
      console.log('❌ Email sending failed:');
      console.log(`   Error: ${result.error}`);
    }
    
  } catch (error) {
    console.log('❌ Email test failed:');
    console.log(`   Error: ${error.message}`);
    console.log('');
    console.log('🔧 Common solutions:');
    console.log('1. Check your internet connection');
    console.log('2. Verify SMTP credentials are correct');
    console.log('3. For Gmail: ensure you\'re using an App Password, not regular password');
    console.log('4. Check if "Less secure app access" is enabled (if not using App Password)');
    console.log('5. Verify the email account allows SMTP access');
  }
}

// Run the test
testEmailService()
  .then(() => {
    console.log('\n🏁 Email test completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test script error:', error);
    process.exit(1);
  });
