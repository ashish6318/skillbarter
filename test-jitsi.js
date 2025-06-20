// Simple test to check if Jitsi Meet is available
console.log('Testing Jitsi Meet availability...');

// Check if window.JitsiMeetExternalAPI exists
if (typeof window !== 'undefined') {
  if (window.JitsiMeetExternalAPI) {
    console.log('✅ Jitsi Meet External API is loaded!');
    console.log('API version:', window.JitsiMeetExternalAPI.toString().substring(0, 100));
  } else {
    console.log('❌ Jitsi Meet External API is NOT loaded!');
    console.log('Available window properties:', Object.keys(window).filter(key => key.includes('Jitsi')));
  }
} else {
  console.log('Window object not available (running in Node.js)');
}

// Test basic Jitsi functionality
function testJitsiConnection() {
  if (!window.JitsiMeetExternalAPI) {
    return 'Jitsi API not available';
  }
  
  try {
    // Create a simple test instance (will fail but shows if API works)
    const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName: 'test-room-12345',
      width: 100,
      height: 100,
      parentNode: document.createElement('div')
    });
    
    // Clean up immediately
    api.dispose();
    
    return 'Jitsi API working correctly!';
  } catch (error) {
    return `Jitsi API error: ${error.message}`;
  }
}

// Export for browser testing
if (typeof window !== 'undefined') {
  window.testJitsi = testJitsiConnection;
  console.log('Run window.testJitsi() in browser console to test Jitsi functionality');
}
