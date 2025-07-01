const mongoose = require('mongoose');

// Mock console methods to reduce noise during testing
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

// Setup test database
beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/skill-barter-test';
  await mongoose.connect(MONGODB_URI);
});

// Clean up database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Increase timeout for database operations
jest.setTimeout(30000);
