# 🧪 Comprehensive Testing Guide - Skill Barter Platform

## 📋 Pre-Testing Setup

### 1. Environment Setup
```bash
# Start Backend Server
cd server
npm start

# Start Frontend (in another terminal)
cd ../
npm run dev
```

### 2. Access URLs
- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:5000/api/
- **Simple Browser Test**: Available in VS Code

### 3. Test User Accounts
Create at least 2 user accounts for testing:
- **User A** (Teacher): Will offer skills and teach sessions
- **User B** (Student): Will book sessions and learn skills

---

## 🔐 Authentication System Testing

### Test Registration
1. Navigate to `/register`
2. Fill out the form with:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Skills Offered: Add 2-3 skills (e.g., "JavaScript", "React", "Node.js")
   - Skills Wanted: Add 2-3 skills you want to learn
3. Submit and verify redirect to dashboard
4. Check that user is logged in (navbar shows profile)

### Test Login
1. Navigate to `/login`
2. Use credentials from registration
3. Verify successful login and dashboard access
4. Test "Remember Me" functionality

### Test Profile Management
1. Click profile dropdown in navbar
2. Go to "Profile" page
3. Update profile information:
   - Change bio
   - Add/remove skills
   - Update availability
4. Save changes and verify updates persist

---

## 🔍 Discovery System Testing

### Test User Discovery
1. Navigate to `/discover`
2. **Test Search Functionality**:
   - Search by skill: `JavaScript`
   - Search by name: `John`
   - Test category filters
   - Test location-based filtering

### Test User Profiles
1. Click on any user card in discover page
2. **Verify User Detail Modal**:
   - Profile information displays correctly
   - Skills offered are shown
   - Ratings and reviews visible
   - "Book Session" buttons work for each skill

### Test Skill Booking from Discovery
1. In user detail modal, click "Book Session" for a skill
2. **Verify Schedule Session Modal**:
   - Teacher info displays correctly
   - Duration options available (30min, 1h, 1.5h, 2h)
   - Date selection works (next 14 days)
   - Time slots load when date selected
3. Book a session and verify success

---

## 📅 Session Management Testing

### Test Session Booking Flow
1. Go to `/discover` and book a session (as Student)
2. **Verify Session Creation**:
   - Check `/sessions` page shows new pending session
   - Verify session appears with correct status: "Pending"
   - Check session details are accurate

### Test Session Approval (Teacher Side)
1. **Login as Teacher** (the user who was booked)
2. Go to `/sessions`
3. **Test Pending Session Actions**:
   - Find the pending session
   - Click "Accept" button
   - Verify session status changes to "Confirmed"
   - Test "Reject" button with another session

### Test Session Dashboard
1. Navigate to `/sessions`
2. **Test Filter Functionality**:
   - Filter by "Upcoming" sessions
   - Filter by "Pending" sessions
   - Filter by "In Progress" sessions
   - Filter by "Completed" sessions
3. **Verify Session Counts**:
   - Check stats cards show correct numbers
   - Verify counts update when filtering

### Test Session Rescheduling
1. Find a confirmed session
2. Click "Reschedule" button
3. **Test Reschedule Modal**:
   - Select new date/time (must be in future)
   - Add reason for rescheduling
   - Submit and verify success
   - Check that other participant gets notification

### Test Session Cancellation
1. Find a confirmed session
2. Click "Cancel" button
3. Provide cancellation reason
4. Verify session status changes to "Cancelled"
5. Check that credits are refunded (if applicable)

---

## 📹 Video Call System Testing

### Test Session Start
1. **Find Confirmed Session** (within 15 minutes of scheduled time)
2. Click "Start Session" button
3. **Verify Video Call Setup**:
   - Session room page loads (`/session/:id/room`)
   - Jitsi Meet interface initializes
   - Both participants can join
   - Audio/video controls work

### Test Video Call Features
1. **Test Media Controls**:
   - Mute/unmute microphone
   - Turn video on/off
   - Check screen sharing
   - Test chat functionality

### Test Session End
1. During active session, click "End Session"
2. **Verify End Session Process**:
   - Confirm dialog appears
   - Option to add session notes
   - Credits are processed correctly
   - Session status changes to "Completed"

---

## 💳 Credit System Testing

### Test Credit Purchase
1. Navigate to `/credits`
2. Click "Buy Credits" button
3. **Test Purchase Modal**:
   - Select different credit packages
   - Verify bonus credits display
   - Complete mock purchase
   - Check balance updates immediately
   - Verify purchase notification appears

### Test Credit Transfer
1. Click "Transfer" button in credits page
2. **Test Transfer Modal**:
   - Enter recipient username/email
   - Set transfer amount
   - Add optional message
   - Submit transfer
   - Verify balance decreases
   - Check transfer notification

### Test Credit Analytics
1. Switch to "Analytics" tab in credits page
2. **Test Analytics Dashboard**:
   - Change time range (7d, 30d, 90d)
   - Verify charts update with new data
   - Check transaction breakdown
   - Test refresh functionality
   - Verify statistics are accurate

### Test Credit Transactions
1. **Verify Transaction History**:
   - All purchases appear in history
   - Transfers show correctly
   - Session-related transactions logged
   - Transaction details are accurate
   - Pagination works if many transactions

---

## 🔔 Notification System Testing

### Test Notification Center
1. **Check Bell Icon** in navbar
2. **Test Notification Features**:
   - Click bell to open notification center
   - Verify unread count badge
   - Test "Mark all read" functionality
   - Test "Clear all" functionality
   - Check notification timestamps

### Test Credit Notifications
1. **Perform credit operations** and verify notifications:
   - Purchase credits → Purchase notification
   - Transfer credits → Transfer notification
   - Receive credits → Receive notification
   - Low credits → Warning notification (when balance ≤ 5)

### Test Session Notifications
1. **Book a session** and verify:
   - Booking confirmation notification
   - Teacher receives session request notification
   - Acceptance/rejection notifications
   - Rescheduling notifications

### Test Session Reminders
1. **Create test session** 15 minutes in future
2. **Verify Reminder System**:
   - Wait for 24-hour reminder (or test manually)
   - Check 1-hour reminder
   - Verify 15-minute reminder with "Join Session" button
   - Test reminder dismissal

---

## 🔄 Real-time Features Testing

### Test Socket.IO Connection
1. **Open browser developer tools**
2. Check console for Socket.IO connection messages
3. **Test Real-time Updates**:
   - Book session in one browser tab
   - Check if teacher sees real-time notification in another tab
   - Test session status updates in real-time

### Test Multi-user Scenarios
1. **Use two browser windows** (or incognito mode)
2. **Test Real-time Communication**:
   - Send messages in one window
   - Verify they appear in other window
   - Test typing indicators
   - Check online/offline status updates

---

## 📱 Responsive Design Testing

### Test Mobile Layout
1. **Open browser developer tools**
2. **Switch to mobile view** (iPhone/Android simulation)
3. **Test All Pages**:
   - Registration/Login forms
   - Dashboard layout
   - Session booking modal
   - Credit management
   - Navigation menu (hamburger)

### Test Tablet Layout
1. **Test medium screen sizes** (768px - 1024px)
2. **Verify Layout Adjustments**:
   - Grid layouts adapt properly
   - Modals are responsive
   - Navigation remains usable
   - Content is readable

---

## ⚠️ Error Handling Testing

### Test Invalid Inputs
1. **Registration with invalid data**:
   - Invalid email format
   - Weak passwords
   - Missing required fields
2. **Session booking errors**:
   - Try to book past time slots
   - Insufficient credits
   - Invalid teacher selection

### Test Network Errors
1. **Simulate network issues**:
   - Disconnect internet during operations
   - Check error messages display
   - Verify retry mechanisms work
   - Test offline behavior

### Test Rate Limiting
1. **Rapid API calls**:
   - Make many credit requests quickly
   - Verify rate limiting kicks in
   - Check 429 error handling
   - Test backoff mechanisms

---

## 🔧 Performance Testing

### Test Loading Times
1. **Measure page load speeds**:
   - Dashboard initial load
   - Session page with many sessions
   - Credit analytics with charts
   - Video call initialization

### Test Data Handling
1. **Test with large datasets**:
   - Many transactions in credit history
   - Multiple sessions in session list
   - Large user lists in discovery
   - Check pagination performance

---

## 🎯 End-to-End Testing Scenarios

### Complete User Journey #1: Teacher
1. **Register as teacher** with multiple skills
2. **Set up profile** with bio and availability
3. **Receive session booking** from student
4. **Accept the session** request
5. **Join video call** at scheduled time
6. **Complete session** and add notes
7. **Receive credits** for teaching
8. **Check credit analytics** and history

### Complete User Journey #2: Student
1. **Register as student** seeking specific skills
2. **Browse discovery page** for teachers
3. **Book session** with preferred teacher
4. **Receive confirmation** notification
5. **Join video call** at scheduled time
6. **Complete session** successfully
7. **Submit review** and rating
8. **Check credit usage** in analytics

### Complete User Journey #3: Platform Admin
1. **Test reminder system** manually
2. **Check system notifications** work
3. **Verify all API endpoints** respond
4. **Test error scenarios** gracefully handled
5. **Confirm data persistence** across sessions

---

## 📊 Testing Checklist

### ✅ Authentication
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Profile updates persist
- [ ] Password validation works

### ✅ Session Management
- [ ] Session booking complete flow
- [ ] Accept/reject functionality
- [ ] Video calls work properly
- [ ] Session completion process
- [ ] Rescheduling works
- [ ] Cancellation with refunds

### ✅ Credit System
- [ ] Credit purchases process
- [ ] Credit transfers work
- [ ] Transaction history accurate
- [ ] Analytics charts display
- [ ] Low credit warnings

### ✅ Notifications
- [ ] Notification center functional
- [ ] Real-time notifications work
- [ ] Session reminders trigger
- [ ] Credit notifications appear

### ✅ Real-time Features
- [ ] Socket.IO connections stable
- [ ] Multi-user scenarios work
- [ ] Online status updates
- [ ] Real-time messaging

### ✅ UI/UX
- [ ] Responsive design works
- [ ] Mobile layout functional
- [ ] Error messages clear
- [ ] Loading states show

---

## 🐛 Bug Reporting Template

When you find issues during testing, document them as:

```
**Bug Title**: [Brief description]
**Severity**: High/Medium/Low
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen
**Actual Result**: What actually happened
**Browser**: Chrome/Firefox/Safari version
**Screen Size**: Desktop/Mobile/Tablet
**Additional Info**: Screenshots, console errors, etc.
```

---

## 🚀 Production Readiness Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables configured
- [ ] SMTP settings for emails
- [ ] Database indexes optimized
- [ ] Security headers in place
- [ ] Rate limiting configured
- [ ] Error monitoring setup
- [ ] Backup strategy defined
- [ ] Performance benchmarks met

---

## 📞 Support and Troubleshooting

### Common Issues and Solutions

1. **Jitsi Meet not loading**:
   - Check external_api.js script loads
   - Verify no browser blocking
   - Try different browser

2. **Socket.IO connection issues**:
   - Check server is running
   - Verify correct port (5000)
   - Check CORS settings

3. **Credit transactions not appearing**:
   - Check network requests in dev tools
   - Verify rate limiting not triggered
   - Check MongoDB connection

4. **Session reminders not working**:
   - Verify cron jobs are running
   - Check session times are in future
   - Test manual reminder endpoint

Remember to test thoroughly in different browsers (Chrome, Firefox, Safari, Edge) and on different devices (desktop, tablet, mobile) to ensure cross-platform compatibility!

---

## 📹 **SINGLE-DEVICE VIDEO FEATURES TESTING**

### 🎯 Overview
Testing video features on a single device during development requires multiple browser tabs/windows to simulate different users. Here's how to thoroughly test the Jitsi Meet integration:

### 🔧 Pre-Testing Setup for Video Features

#### 1. Ensure Jitsi External API is Loaded
First, verify that the Jitsi Meet External API is properly loaded:

```html
<!-- This should be in your index.html -->
<script src="https://meet.jit.si/external_api.js"></script>
```

#### 2. Browser Requirements
- **Chrome/Chromium** (Recommended for best video support)
- **Firefox** (Good alternative)
- **Edge** (Also works well)
- Avoid Safari for development testing (limited WebRTC support)

#### 3. Camera/Microphone Permissions
- Allow camera and microphone access when prompted
- Test with different permission states

---

### 🎭 Single-Device Testing Strategy

#### Method 1: Multiple Browser Windows
1. **Open 2 different browsers** (e.g., Chrome + Firefox)
2. **Login as different users** in each browser:
   - Browser 1: Login as Teacher (User A)
   - Browser 2: Login as Student (User B)

#### Method 2: Incognito/Private Windows
1. **Use same browser with incognito mode**:
   - Regular window: Login as Teacher
   - Incognito window: Login as Student

#### Method 3: Multiple Browser Tabs (Advanced)
1. **Use Chrome's user profiles**:
   - Create different Chrome profiles
   - Each profile maintains separate sessions

---

### 🚀 Step-by-Step Video Testing

#### Step 1: Create Test Session
1. **In Student Browser/Tab**:
   ```
   - Go to /discover
   - Find a teacher
   - Book a session for "NOW + 5 minutes" (to allow testing)
   - Note the session ID
   ```

2. **In Teacher Browser/Tab**:
   ```
   - Go to /sessions
   - Accept the pending session
   - Session status should change to "confirmed"
   ```

#### Step 2: Test Session Start (15-Minute Window)
1. **Wait until within 15 minutes of scheduled time**
2. **In either browser** (teacher or student):
   ```
   - Go to /sessions
   - Find the confirmed session
   - Click "Start Session" button
   ```

3. **Verify Session Start**:
   ```
   - Session status changes to "in_progress"
   - Room ID is generated
   - Meeting URL is created
   - Both users get real-time notification
   ```

#### Step 3: Test Video Room Access
1. **In the browser that started the session**:
   ```
   - Should automatically redirect to /session/{id}/room
   - Jitsi Meet interface should load
   - Video preview should appear
   ```

2. **In the other browser**:
   ```
   - Go to /sessions
   - Find the "in_progress" session
   - Click "Join Session" button
   - Should redirect to same room URL
   ```

#### Step 4: Test Video Call Features

##### Basic Video/Audio Controls
1. **Test Microphone Toggle**:
   ```
   - Click microphone button in Jitsi interface
   - Verify mute/unmute works
   - Check that other participant sees mute status
   ```

2. **Test Camera Toggle**:
   ```
   - Click video button in Jitsi interface
   - Verify video on/off works
   - Check that other participant sees video status
   ```

3. **Test Audio Output**:
   ```
   - Speak in one browser
   - Verify audio is heard in other browser
   - Test volume controls
   ```

##### Advanced Features
1. **Test Screen Sharing**:
   ```
   - Click screen share button
   - Select screen/window to share
   - Verify other participant can see shared screen
   ```

2. **Test Chat Function**:
   ```
   - Open chat panel in Jitsi
   - Send messages between participants
   - Verify messages appear in real-time
   ```

3. **Test Participant List**:
   ```
   - Verify both participants appear in participant list
   - Check participant names display correctly
   - Test participant actions (mute others, etc.)
   ```

#### Step 5: Test Session Management During Call

1. **Test Session Duration Timer**:
   ```
   - Verify session duration displays and updates
   - Check that timer is synchronized between participants
   ```

2. **Test Session Status Updates**:
   ```
   - Session should show as "in_progress" in /sessions page
   - Status should update in real-time
   ```

3. **Test Connection Status**:
   ```
   - Check browser console for WebRTC connection logs
   - Verify no connection errors
   - Test reconnection if network briefly disconnected
   ```

#### Step 6: Test Session End

1. **End Session via Platform**:
   ```
   - In one browser, click "End Session" button (not Jitsi hangup)
   - Should show confirmation dialog
   - Add optional session notes
   - Confirm session end
   ```

2. **Verify Session Completion**:
   ```
   - Session status changes to "completed"
   - Both participants are redirected from video room
   - Credits are processed (if applicable)
   - Session completion notification sent
   ```

3. **End Session via Jitsi Hangup**:
   ```
   - Click hangup button in Jitsi interface
   - Should trigger session end flow
   - Verify proper cleanup
   ```

---

### 🔍 **Detailed Video Feature Checklist**

#### ✅ Pre-Call Testing
- [ ] Jitsi External API script loads successfully
- [ ] Camera permissions granted
- [ ] Microphone permissions granted
- [ ] Session can be started within 15-minute window
- [ ] Room ID generates correctly
- [ ] Meeting URL is accessible

#### ✅ Video Call Initialization
- [ ] Jitsi Meet interface loads properly
- [ ] Video preview appears before joining
- [ ] Audio/video controls are visible
- [ ] Participant joins successfully
- [ ] Join/leave notifications work

#### ✅ Media Controls Testing
- [ ] Microphone mute/unmute functions
- [ ] Camera on/off functions
- [ ] Audio output works between participants
- [ ] Video feed displays properly
- [ ] Media status synchronizes between participants

#### ✅ Advanced Features Testing
- [ ] Screen sharing works
- [ ] Chat messaging functions
- [ ] Participant list displays correctly
- [ ] Full-screen mode works
- [ ] Settings panel accessible

#### ✅ Session Management During Call
- [ ] Session duration timer updates
- [ ] Session status shows "in_progress"
- [ ] Real-time status updates work
- [ ] Other participant notifications work

#### ✅ Session End Testing
- [ ] Platform "End Session" button works
- [ ] Jitsi "Hangup" button triggers end
- [ ] Session completion flow executes
- [ ] Credits processed correctly
- [ ] Participants redirected properly
- [ ] Cleanup happens correctly

---

### 🐛 **Common Video Issues & Troubleshooting**

#### Issue 1: Jitsi Meet Not Loading
**Symptoms**: Video room shows loading spinner indefinitely
**Solutions**:
```javascript
// Check in browser console:
console.log(window.JitsiMeetExternalAPI); // Should not be undefined

// Check if script loaded:
<script src="https://meet.jit.si/external_api.js"></script>
```

#### Issue 2: Camera/Microphone Not Working
**Symptoms**: No video/audio feed
**Solutions**:
1. Check browser permissions (lock icon in address bar)
2. Try different browser
3. Check if other apps are using camera/microphone

#### Issue 3: Session Won't Start
**Symptoms**: "Start Session" button doesn't work
**Solutions**:
1. Verify session is "confirmed" status
2. Check if within 15-minute window of scheduled time
3. Ensure user is participant in session

#### Issue 4: Time Slots Showing Same Start/End Times
**Symptoms**: 30-minute slots display as "2:00 PM - 2:00 PM" instead of "2:00 PM - 2:30 PM"
**Root Cause**: The `addHours` function from `date-fns` was not working correctly
**Solution**: Replaced with custom `addHours` function in backend
**Status**: ✅ **FIXED**

#### Issue 5: Connection Problems
**Symptoms**: Poor audio/video quality, frequent disconnections
**Solutions**:
1. Check network connection
2. Try different browser
3. Check firewall/antivirus settings

---

### 🧪 **Manual Testing Script for Video Features**

Here's a complete testing script you can follow:

#### Phase 1: Setup (5 minutes)
```
1. Open Chrome browser → Login as Teacher
2. Open Firefox browser → Login as Student  
3. Create session from Student → Accept from Teacher
4. Wait for scheduled time (or modify time to be within 15 min)
```

#### Phase 2: Basic Video Test (10 minutes)
```
5. Start session from Teacher browser
6. Join session from Student browser
7. Test audio: speak in each browser, verify hearing
8. Test video: turn on/off camera in each browser
9. Test mute: mute/unmute microphone in each browser
```

#### Phase 3: Advanced Features (10 minutes)
```
10. Test screen sharing from Teacher browser
11. Test chat messaging between participants
12. Test participant list and controls
13. Test full-screen mode
```

#### Phase 4: Session Management (5 minutes)
```
14. Verify session shows as "in_progress" in /sessions
15. Check session duration timer
16. End session via platform button
17. Verify session completion and credit processing
```

---

### 📊 **Video Testing Results Template**

Document your testing results:

```
**Test Date**: [Date/Time]
**Browsers Used**: [Chrome + Firefox / Chrome + Incognito / etc.]
**Session ID**: [Session ID tested]

**Basic Functionality**:
- Session Start: ✅/❌
- Video Feed: ✅/❌  
- Audio Feed: ✅/❌
- Media Controls: ✅/❌

**Advanced Features**:
- Screen Share: ✅/❌
- Chat: ✅/❌
- Participant List: ✅/❌

**Session Management**:
- Status Updates: ✅/❌
- Duration Timer: ✅/❌
- Session End: ✅/❌
- Credit Processing: ✅/❌

**Issues Found**: [List any problems encountered]
**Notes**: [Additional observations]
```

This comprehensive testing approach will help you thoroughly validate all video features on a single device during development!
