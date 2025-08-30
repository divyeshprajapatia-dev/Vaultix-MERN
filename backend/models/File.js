// models/File.js - File data structure for Vaultix
const mongoose = require('mongoose');

// Define what information we store for each file
const fileSchema = new mongoose.Schema({
  // File identification
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true
  },
  
  // File details
  fileName: {
    type: String,
    required: [true, 'Filename is required']
  },
  
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [1, 'File size must be greater than 0']
  },
  
  mimeType: {
    type: String,
    required: [true, 'File type is required']
  },
  
  // IPFS and Pinata information
  ipfsHash: {
    type: String,
    required: [true, 'IPFS hash is required']
  },
  
  pinataUrl: {
    type: String,
    required: [true, 'Pinata URL is required']
  },
  
  // File categorization
  category: {
    type: String,
    enum: ['image', 'document', 'video', 'audio', 'archive', 'other'],
    default: 'other'
  },
  
  // File description (optional)
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // File access settings
  isPublic: {
    type: Boolean,
    default: false // Files are private by default
  },
  
  accessCount: {
    type: Number,
    default: 0 // How many times the file has been accessed
  },
  
  // File sharing
  shareToken: {
    type: String,
    unique: true,
    sparse: true // Only create index for non-null values
  },
  
  // File owner
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'User ID is required']
  },
  
  // File status
  status: {
    type: String,
    enum: ['active', 'deleted', 'processing'],
    default: 'active'
  },
  
  // Timestamps
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
fileSchema.index({ uploadedBy: 1, uploadedAt: -1 }); // For user's files, newest first
fileSchema.index({ ipfsHash: 1 }); // For quick hash lookups
fileSchema.index({ shareToken: 1 }); // For shared file access
// Compound unique index: user can only upload same file once, but different users can upload same file
fileSchema.index({ uploadedBy: 1, ipfsHash: 1 }, { unique: true });

// Method to determine file category based on MIME type
fileSchema.methods.determineCategory = function() {
  const mimeType = this.mimeType.toLowerCase();
  
  if (mimeType.startsWith('image/')) {
    this.category = 'image';
  } else if (mimeType.startsWith('video/')) {
    this.category = 'video';
  } else if (mimeType.startsWith('audio/')) {
    this.category = 'audio';
  } else if (mimeType.includes('pdf') || mimeType.includes('document') || 
             mimeType.includes('text') || mimeType.includes('spreadsheet') ||
             mimeType.includes('presentation')) {
    this.category = 'document';
  } else if (mimeType.includes('zip') || mimeType.includes('rar') || 
             mimeType.includes('tar') || mimeType.includes('gz')) {
    this.category = 'archive';
  } else {
    this.category = 'other';
  }
};

// Method to increment access count
fileSchema.methods.incrementAccessCount = async function() {
  this.accessCount += 1;
  this.lastAccessedAt = new Date();
  await this.save();
};

// Method to generate share token
fileSchema.methods.generateShareToken = function() {
  const crypto = require('crypto');
  this.shareToken = crypto.randomBytes(32).toString('hex');
  return this.shareToken;
};

// Method to format file size for display
fileSchema.methods.getFormattedSize = function() {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Pre-save middleware to set category and update timestamp
fileSchema.pre('save', function(next) {
  if (this.isNew) {
    this.determineCategory();
  }
  this.updatedAt = new Date();
  next();
});

// Create and export the File model
const File = mongoose.model('File', fileSchema);
module.exports = File;