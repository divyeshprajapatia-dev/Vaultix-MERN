// models/User.js - User data structure for Vaultix
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define what information we store for each user
const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true, // Removes extra spaces
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true, // No two users can have the same email
    lowercase: true, // Converts to lowercase automatically
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation pattern
      'Please provide a valid email address'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password when fetching user data (for security)
  },
  
  // User profile information
  avatar: {
    type: String, // URL to profile picture (we might add this feature later)
    default: null
  },
  
  // Account settings
  role: {
    type: String,
    enum: ['user', 'admin'], // Only these values are allowed
    default: 'user'
  },
  
  isVerified: {
    type: Boolean,
    default: false // Email verification (we might add this later)
  },
  
  // Storage statistics
  totalFilesUploaded: {
    type: Number,
    default: 0
  },
  
  totalStorageUsed: {
    type: Number,
    default: 0 // In bytes
  },
  
  // Account activity
  lastLogin: {
    type: Date,
    default: null
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to hash password before saving to database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash the password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if provided password matches the stored password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to update user's last login time
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

// Method to increment file count and storage used
userSchema.methods.incrementStorage = async function(fileSize) {
  this.totalFilesUploaded += 1;
  this.totalStorageUsed += fileSize;
  this.updatedAt = new Date();
  await this.save();
};

// Method to decrement file count and storage used
userSchema.methods.decrementStorage = async function(fileSize) {
  this.totalFilesUploaded = Math.max(0, this.totalFilesUploaded - 1);
  this.totalStorageUsed = Math.max(0, this.totalStorageUsed - fileSize);
  this.updatedAt = new Date();
  await this.save();
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;