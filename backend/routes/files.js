// routes/files.js - File routes for Vaultix
const express = require('express');
const {
  uploadFile,
  getUserFiles,
  getFile,
  deleteFile,
  updateFile,
  generateShareLink,
  accessSharedFile
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const { uploadSingle, handleUploadError, validateUploadedFile } = require('../middleware/upload');

const router = express.Router();

// Protected routes (require authentication)
router.post('/upload', 
  protect, 
  uploadSingle, 
  handleUploadError, 
  validateUploadedFile, 
  uploadFile
);

router.get('/', protect, getUserFiles);
router.get('/:id', protect, getFile);
router.put('/:id', protect, updateFile);
router.delete('/:id', protect, deleteFile);
router.post('/:id/share', protect, generateShareLink);

// Public routes (no authentication required)
router.get('/shared/:token', accessSharedFile);

module.exports = router;