# Email Notification Testing Guide for SkillBarter

This guide explains how to check if mail notifications are working in your SkillBarter application.

## Quick Test Steps

### 1. Check Email Configuration
```bash
# Run the email test script
cd server
node test-email.js
```

### 2. Configure Email Credentials (if needed)

If you see "Email configuration not properly set up", follow these steps:

#### For Gmail:
1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → App Passwords
   - Generate new app password for "SkillBarter"
   - Copy the generated password (16 characters)

3. **Update `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

#### For Other Email Providers:
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's settings

### 3. Test Email Sending
```bash
# After configuring credentials, run test again
node test-email.js
```

You should see:
- ✅ Email sent successfully!
- Check your inbox for the test email

## Monitoring Email Notifications

### 1. Check Server Logs
When emails are sent, you'll see logs like:
```
Session request email sent to teacher: teacher@example.com
Session confirmation email sent to student: student@example.com
Email reminder sent to teacher: teacher@example.com
Session completion email sent to student: student@example.com
```

### 2. Check Failed Email Logs
If emails fail, you'll see:
```
Failed to send session request email: [Error details]
Failed to send email reminders for session: [Error details]
```

## Email Notification Types

The system sends emails for these events:

### 1. Session Request
- **Trigger**: Student requests a session
- **Recipient**: Teacher
- **Content**: Session details, accept/decline links

### 2. Session Confirmation
- **Trigger**: Teacher accepts session
- **Recipient**: Student
- **Content**: Confirmation details, credits deducted

### 3. Session Cancellation
- **Trigger**: Either party cancels
- **Recipient**: Other participant
- **Content**: Cancellation notice, refund info

### 4. Session Reminders
- **Trigger**: 24h, 1h, 15min before session
- **Recipients**: Both teacher and student
- **Content**: Reminder with join link

### 5. Session Completion
- **Trigger**: Session ends
- **Recipients**: Both participants
- **Content**: Completion confirmation, credits earned

## Testing Email Notifications End-to-End

### 1. Set up Test Users
Create two test accounts with different email addresses:
- Teacher account: `teacher@test.com`
- Student account: `student@test.com`

### 2. Test Session Flow
1. **Request Session** (as student) → Check teacher email
2. **Accept Session** (as teacher) → Check student email
3. **Wait for Reminders** → Check both emails (15min intervals)
4. **Complete Session** → Check both emails

### 3. Test Cancellation
1. **Cancel Session** → Check recipient email
2. **Verify refund email** for student

## Troubleshooting

### Common Issues

#### 1. "Authentication failed"
- Check SMTP credentials
- For Gmail: Use App Password, not regular password
- Verify 2FA is enabled

#### 2. "Connection timeout"
- Check internet connection
- Verify SMTP host and port
- Check firewall settings

#### 3. "Email not received"
- Check spam/junk folder
- Verify recipient email address
- Check email provider restrictions

#### 4. "Process.env not defined" error
- Ensure `.env` file exists in server directory
- Check `.env` file format (no spaces around =)
- Restart server after changing `.env`

### Debug Steps

1. **Check Environment Variables**:
```javascript
console.log('SMTP Config:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? 'SET' : 'NOT SET'
});
```

2. **Test SMTP Connection**:
```bash
# Install telnet to test SMTP
telnet smtp.gmail.com 587
```

3. **Check Server Logs**:
```bash
# Monitor server logs for email activity
tail -f server/logs/app.log  # if logging to file
# or check console output
```

## Production Considerations

### 1. Use Environment Variables
Never commit email credentials to git:
```env
# Production .env
SMTP_USER=production-email@yourcompany.com
SMTP_PASS=secure-app-password
```

### 2. Email Rate Limiting
Consider rate limiting for production:
- Max emails per hour
- Batch processing for reminders
- Queue system for high volume

### 3. Email Templates
- Store templates in separate files
- Support multiple languages
- Include unsubscribe links

### 4. Monitoring
- Log all email attempts
- Track delivery rates
- Monitor bounce rates
- Set up alerts for failures

## Verification Checklist

- [ ] Email configuration is set up
- [ ] Test email sends successfully
- [ ] Session request emails work
- [ ] Session confirmation emails work
- [ ] Session reminder emails work
- [ ] Session completion emails work
- [ ] Session cancellation emails work
- [ ] Error handling works (logs failures)
- [ ] Emails appear professional
- [ ] Links in emails work correctly

## Success Indicators

✅ **Email notifications are working if:**
- Test script shows "Email sent successfully"
- Server logs show successful email sends
- Recipients receive emails in their inbox
- Email content displays correctly
- Links in emails work
- No error logs related to email sending

❌ **Email notifications need fixing if:**
- Test script shows errors
- Server logs show email failures
- Recipients don't receive emails
- Emails go to spam consistently
- Links in emails are broken
- Constant error logs about email sending
