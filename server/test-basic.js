// Simple server test
console.log('🔍 Testing server components...');

try {
  // Test basic requires
  console.log('📦 Testing requires...');
  const express = require('express');
  const mongoose = require('mongoose');
  require('dotenv').config();
  console.log('✅ Basic requires working');

  // Test environment variables
  console.log('🌍 Testing environment...');
  console.log('PORT:', process.env.PORT || 'Not set');
  console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not set');
  console.log('✅ Environment check complete');

  // Test express app creation
  console.log('🚀 Testing Express app...');
  const app = express();
  console.log('✅ Express app created');

  // Quick server test
  const server = app.listen(5001, () => {
    console.log('✅ Test server started on port 5001');
    console.log('🏁 All tests passed! Main server should work.');
    server.close();
    process.exit(0);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
