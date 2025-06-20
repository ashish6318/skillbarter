const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

console.log('🔍 Running Server Health Check...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`   PORT: ${process.env.PORT || 'Not set'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI || 'Not set'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set'}\n`);

// Test MongoDB connection
async function testDatabase() {
  try {
    console.log('🗄️  Testing database connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbarter', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Database connection successful');
    
    // Check if collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections:`, collections.map(c => c.name).join(', '));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Test server startup
async function testServer() {
  try {
    console.log('\n🚀 Testing server startup...');
    const app = express();
    
    app.get('/test', (req, res) => {
      res.json({ success: true, message: 'Server is working!' });
    });
    
    const server = app.listen(5001, () => {
      console.log('✅ Server startup successful (test port 5001)');
      server.close();
    });
    
    server.on('error', (error) => {
      console.error('❌ Server startup failed:', error.message);
    });
    
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testDatabase();
  await testServer();
  console.log('\n🏁 Health check complete!');
  process.exit(0);
}

runTests().catch(console.error);
