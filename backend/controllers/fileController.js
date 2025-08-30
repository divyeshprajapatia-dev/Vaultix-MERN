// controllers/fileController.js - File operations controller for Vaultix
const File = require('../models/File');
const User = require('../models/User');
const { uploadToPinata, unpinFromPinata } = require('../utils/pinata');
const crypto = require('crypto');

// @desc    Upload file to IPFS
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    const { description } = req.body;
    const uploadedFile = req.file;
    const userId = req.user.userId;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`📤 Starting file upload for user: ${user.email}`);

    // Upload file to Pinata IPFS
    const pinataResult = await uploadToPinata(
      uploadedFile.buffer,
      uploadedFile.originalname,
      uploadedFile.mimetype
    );

    // Create file record in database
    const fileRecord = await File.create({
      originalName: uploadedFile.originalname,
      fileName: uploadedFile.originalname,
      fileSize: uploadedFile.size,
      mimeType: uploadedFile.mimetype,
      ipfsHash: pinataResult.ipfsHash,
      pinataUrl: pinataResult.gatewayUrl,
      description: description || '',
      uploadedBy: userId,
      status: 'active'
    });

    // Update user's storage statistics
    await user.incrementStorage(uploadedFile.size);

    console.log(`✅ File uploaded successfully: ${fileRecord.originalName}`);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully to IPFS!',
      file: {
        _id: fileRecord._id,
        originalName: fileRecord.originalName,
        fileSize: fileRecord.fileSize,
        mimeType: fileRecord.mimeType,
        category: fileRecord.category,
        ipfsHash: fileRecord.ipfsHash,
        pinataUrl: fileRecord.pinataUrl,
        publicUrl: `https://ipfs.io/ipfs/${fileRecord.ipfsHash}`,
        description: fileRecord.description,
        uploadedAt: fileRecord.uploadedAt,
        formattedSize: fileRecord.getFormattedSize()
      }
    });

  } catch (error) {
    console.error('❌ File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file: ' + error.message
    });
  }
};

// @desc    Get all files for current user
// @route   GET /api/files
// @access  Private
exports.getUserFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, category, search } = req.query;

    // Build query
    let query = { uploadedBy: userId, status: 'active' };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get files with pagination
    const files = await File.find(query)
      .sort({ uploadedAt: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'name email');

    // Get total count for pagination
    const totalFiles = await File.countDocuments(query);
    const totalPages = Math.ceil(totalFiles / limit);

    // Format files for response
    const formattedFiles = files.map(file => ({
      _id: file._id,
      originalName: file.originalName,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      category: file.category,
      ipfsHash: file.ipfsHash,
      pinataUrl: file.pinataUrl,
      publicUrl: `https://ipfs.io/ipfs/${file.ipfsHash}`,
      description: file.description,
      isPublic: file.isPublic,
      accessCount: file.accessCount,
      uploadedAt: file.uploadedAt,
      lastAccessedAt: file.lastAccessedAt,
      formattedSize: file.getFormattedSize()
    }));

    res.status(200).json({
      success: true,
      files: formattedFiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalFiles,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get files'
    });
  }
};

// @desc    Get single file details
// @route   GET /api/files/:id
// @access  Private
exports.getFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      status: 'active'
    }).populate('uploadedBy', 'name email');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Increment access count
    await file.incrementAccessCount();

    res.status(200).json({
      success: true,
      file: {
        _id: file._id,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        category: file.category,
        ipfsHash: file.ipfsHash,
        pinataUrl: file.pinataUrl,
        publicUrl: `https://ipfs.io/ipfs/${file.ipfsHash}`,
        description: file.description,
        isPublic: file.isPublic,
        accessCount: file.accessCount,
        uploadedAt: file.uploadedAt,
        lastAccessedAt: file.lastAccessedAt,
        formattedSize: file.getFormattedSize(),
        owner: file.uploadedBy.name
      }
    });

  } catch (error) {
    console.error('❌ Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file'
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    // Find file
    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      status: 'active'
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    console.log(`🗑️ Deleting file: ${file.originalName}`);

    // Unpin from Pinata
    await unpinFromPinata(file.ipfsHash);

    // Update file status to deleted (soft delete)
    file.status = 'deleted';
    file.updatedAt = new Date();
    await file.save();

    // Update user's storage statistics
    const user = await User.findById(userId);
    await user.decrementStorage(file.fileSize);

    console.log(`✅ File deleted successfully: ${file.originalName}`);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file: ' + error.message
    });
  }
};

// @desc    Update file details
// @route   PUT /api/files/:id
// @access  Private
exports.updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;
    const { description, isPublic } = req.body;

    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      status: 'active'
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Update fields
    if (description !== undefined) {
      file.description = description.trim();
    }
    
    if (isPublic !== undefined) {
      file.isPublic = Boolean(isPublic);
    }

    file.updatedAt = new Date();
    await file.save();

    console.log(`✅ File updated: ${file.originalName}`);

    res.status(200).json({
      success: true,
      message: 'File updated successfully',
      file: {
        _id: file._id,
        originalName: file.originalName,
        description: file.description,
        isPublic: file.isPublic,
        updatedAt: file.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Update file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update file'
    });
  }
};

// @desc    Generate shareable link for file
// @route   POST /api/files/:id/share
// @access  Private
exports.generateShareLink = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      status: 'active'
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Generate share token if doesn't exist
    if (!file.shareToken) {
      file.generateShareToken();
      await file.save();
    }

    const shareUrl = `${req.protocol}://${req.get('host')}/api/files/shared/${file.shareToken}`;

    res.status(200).json({
      success: true,
      message: 'Share link generated successfully',
      shareToken: file.shareToken,
      shareUrl: shareUrl,
      ipfsUrl: `https://ipfs.io/ipfs/${file.ipfsHash}`
    });

  } catch (error) {
    console.error('❌ Generate share link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate share link'
    });
  }
};

// @desc    Access shared file (public access)
// @route   GET /api/files/shared/:token
// @access  Public
exports.accessSharedFile = async (req, res) => {
  try {
    const shareToken = req.params.token;

    const file = await File.findOne({
      shareToken: shareToken,
      status: 'active'
    }).populate('uploadedBy', 'name');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Shared file not found or link expired'
      });
    }

    // Increment access count
    await file.incrementAccessCount();

    res.status(200).json({
      success: true,
      file: {
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        category: file.category,
        ipfsHash: file.ipfsHash,
        pinataUrl: file.pinataUrl,
        publicUrl: `https://ipfs.io/ipfs/${file.ipfsHash}`,
        description: file.description,
        uploadedAt: file.uploadedAt,
        formattedSize: file.getFormattedSize(),
        owner: file.uploadedBy.name
      }
    });

  } catch (error) {
    console.error('❌ Access shared file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to access shared file'
    });
  }
};