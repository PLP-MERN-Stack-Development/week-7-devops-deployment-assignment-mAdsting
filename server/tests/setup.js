/**
 * Test setup file for Jest
 * Configures test environment and database connection
 */

const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';

// Connect to test database before all tests
beforeAll(async () => {
  console.log('🧪 Setting up test environment...');
  
  const testDBUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/mern-bug-tracker-test';
  
  try {
    await mongoose.connect(testDBUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
    process.exit(1);
  }
});

// Clear database after each test
afterEach(async () => {
  console.log('🧹 Cleaning up test data...');
  
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  
  console.log('✅ Test data cleaned up');
});

// Close database connection after all tests
afterAll(async () => {
  console.log('🔌 Closing test database connection...');
  await mongoose.connection.close();
  console.log('✅ Test database connection closed');
});

// Global test timeout
jest.setTimeout(30000); 