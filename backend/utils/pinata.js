// utils/pinata.js - Pinata IPFS utility functions for Vaultix
const axios = require('axios');
const FormData = require('form-data');

// Pinata API endpoints
const PINATA_PIN_FILE_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_UNPIN_URL = 'https://api.pinata.cloud/pinning/unpin';
const PINATA_PIN_LIST_URL = 'https://api.pinata.cloud/data/pinList';

// Function to upload file to IPFS via Pinata
exports.uploadToPinata = async (fileBuffer, fileName, mimeType) => {
  try {
    console.log(`📤 Uploading file to Pinata: ${fileName}`);

    // Create form data
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: mimeType
    });

    // Add metadata
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        originalName: fileName,
        mimeType: mimeType,
        uploadedBy: 'Vaultix'
      }
    });
    formData.append('pinataMetadata', metadata);

    // Add pinning options
    const options = JSON.stringify({
      cidVersion: 1, // Use CID version 1
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', options);

    // Make request to Pinata
    const response = await axios.post(PINATA_PIN_FILE_URL, formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    console.log(`✅ File uploaded to IPFS successfully: ${response.data.IpfsHash}`);

    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      publicUrl: `https://ipfs.io/ipfs/${response.data.IpfsHash}`
    };

  } catch (error) {
    console.error('❌ Error uploading to Pinata:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid Pinata API credentials');
    } else if (error.response?.status === 402) {
      throw new Error('Pinata account limit exceeded');
    } else if (error.response?.status === 413) {
      throw new Error('File too large for upload');
    } else {
      throw new Error('Failed to upload file to IPFS');
    }
  }
};

// Function to unpin file from Pinata (delete from IPFS)
exports.unpinFromPinata = async (ipfsHash) => {
  try {
    console.log(`🗑️ Unpinning file from Pinata: ${ipfsHash}`);

    await axios.delete(`${PINATA_UNPIN_URL}/${ipfsHash}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    console.log(`✅ File unpinned successfully: ${ipfsHash}`);
    return { success: true };

  } catch (error) {
    console.error('❌ Error unpinning from Pinata:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('File not found in Pinata, might already be unpinned');
      return { success: true }; // Consider it successful if already unpinned
    }
    
    throw new Error('Failed to unpin file from IPFS');
  }
};

// Function to get pinned files list from Pinata
exports.getPinnedFiles = async (limit = 10, offset = 0) => {
  try {
    const response = await axios.get(PINATA_PIN_LIST_URL, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      params: {
        status: 'pinned',
        pageLimit: limit,
        pageOffset: offset
      }
    });

    return {
      success: true,
      files: response.data.rows,
      count: response.data.count
    };

  } catch (error) {
    console.error('❌ Error getting pinned files:', error.response?.data || error.message);
    throw new Error('Failed to get pinned files list');
  }
};

// Function to test Pinata connection
exports.testPinataConnection = async () => {
  try {
    const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    console.log('✅ Pinata connection test successful:', response.data.message);
    return { success: true, message: response.data.message };

  } catch (error) {
    console.error('❌ Pinata connection test failed:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// Helper function to generate file metadata
exports.generateFileMetadata = (fileName, fileSize, mimeType, userId) => {
  return {
    name: fileName,
    keyvalues: {
      uploadedAt: new Date().toISOString(),
      originalName: fileName,
      fileSize: fileSize.toString(),
      mimeType: mimeType,
      uploadedBy: userId || 'anonymous',
      platform: 'Vaultix'
    }
  };
};

// Helper function to validate file type and size
exports.validateFile = (file, maxSize = 100 * 1024 * 1024) => { // 100MB default
  const errors = [];

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
  }

  // Check if file exists
  if (!file.buffer || file.buffer.length === 0) {
    errors.push('File is empty');
  }

  // Blocked file types (for security)
  const blockedTypes = ['.exe', '.bat', '.com', '.cmd', '.scr', '.pif'];
  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
  
  if (blockedTypes.includes(fileExtension)) {
    errors.push('File type not allowed for security reasons');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};