const mongoose = require('mongoose');

/**
 * Database connection configuration
 * Handles MongoDB connection with proper error handling and debugging
 */
const connectDB = async () => {
  try {
    // Use correct environment variable name for Mongo connection
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-bug-tracker';
    
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📍 Connection URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Debug: Log connection details
    console.log('📊 Database Name:', conn.connection.name);
    console.log('🔧 Connection State:', conn.connection.readyState);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      message: error.message
    });
    
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB; 