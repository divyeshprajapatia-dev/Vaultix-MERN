// server.js - Complete server file for Vaultix
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vaultix', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Load models
const User = require('./models/User');
const File = require('./models/File');
console.log('📋 Models loaded: User, File');

// Basic route to test if server is working
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Vaultix API! 🚀',
    status: 'Server is running perfectly',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'Connected'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Test route for API
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Vaultix API is working perfectly!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      files: '/api/files',
      users: '/api/users (Coming soon)'
    },
    timestamp: new Date().toISOString()
  });
});

// Test Pinata connection
app.get('/api/test/pinata', async (req, res) => {
  try {
    const { testPinataConnection } = require('./utils/pinata');
    const result = await testPinataConnection();
    
    res.json({
      success: result.success,
      message: result.success ? 'Pinata connection successful!' : 'Pinata connection failed',
      details: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing Pinata connection',
      error: error.message
    });
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

// Use routes
app.use('/api/auth', authRoutes);     // For login/signup
app.use('/api/files', fileRoutes);    // For file operations
// app.use('/api/users', userRoutes);    // For user management (coming later)

// Simple error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err.message);
  console.error('Stack trace:', err.stack);
  
  res.status(err.status || 500).json({ 
    success: false,
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 errors (route not found)
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: {
      base: 'GET /',
      health: 'GET /health', 
      test: 'GET /api/test'
    },
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('');
  console.log('🎉 ============================================');
  console.log('🚀 VAULTIX SERVER STARTED SUCCESSFULLY!');
  console.log('🎉 ============================================');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('📁 Database: MongoDB (Local)');
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('📋 Models: User, File');
  console.log('🔧 Status: Ready for development');
  console.log('');
  console.log('📍 Available endpoints:');
  console.log('   GET  / - Welcome message');
  console.log('   GET  /health - Server health check');
  console.log('   GET  /api/test - API test endpoint');
  console.log('');
  console.log('🔄 Watching for changes... (nodemon active)');
  console.log('🛑 Press Ctrl+C to stop the server');
  console.log('============================================');
});