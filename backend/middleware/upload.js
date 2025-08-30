// middleware/upload.js - File upload middleware for Vaultix
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory (RAM)

// File filter function
const fileFilter = (req, file, cb) => {
  // Get file extension
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  // Blocked file types for security
  const blockedExtensions = ['.exe', '.bat', '.com', '.cmd', '.scr', '.pif', '.app', '.msi'];
  
  if (blockedExtensions.includes(fileExtension)) {
    return cb(new Error('File type not allowed for security reasons'), false);
  }

  // Allow all other file types
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB file size limit
    files: 1, // Only allow 1 file at a time
  },
  fileFilter: fileFilter
});

// Single file upload middleware
exports.uploadSingle = upload.single('file');

// Multiple files upload middleware (for future use)
exports.uploadMultiple = upload.array('files', 5); // Max 5 files

// Error handling middleware for multer
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 100MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum is 5 files.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field. Use "file" or "files" as field name.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + err.message
        });
    }
  } else if (err) {
    // Other errors (like file type restrictions)
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Middleware to validate uploaded file
exports.validateUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded. Please select a file.'
    });
  }

  // Additional file validation
  const file = req.file;
  
  // Check if file has content
  if (!file.buffer || file.buffer.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Uploaded file is empty.'
    });
  }

  // Check filename
  if (!file.originalname || file.originalname.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid filename.'
    });
  }

  // Add file info to request for logging
  req.fileInfo = {
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    uploadTimestamp: new Date().toISOString()
  };

  console.log(`📁 File upload validated: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  
  next();
};