const mongoose = require('mongoose');

/**
 * Database connection configuration
 * Handles MongoDB connection with proper error handling and debugging
 */
const connectDB = async () => {
  try {
    // Debug: Log all environment variables (be careful with sensitive data)
    console.log('🔍 Environment variables check:');
    console.log('📍 NODE_ENV:', process.env.NODE_ENV);
    console.log('📍 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('📍 MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
    console.log('📍 MONGODB_URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined');
    
    // Use correct environment variable name for Mongo connection
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      console.error('🔧 Please set MONGODB_URI in your environment variables.');
      process.exit(1);
    }
    
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