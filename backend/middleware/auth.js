// middleware/auth.js - Authentication middleware for Vaultix
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (require authentication)
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. User not found.'
        });
      }

      // Add user to request object
      req.user = decoded;
      next(); // Continue to next middleware/route handler

    } catch (jwtError) {
      console.error('❌ JWT verification error:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }

  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Middleware to restrict access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // Get user details
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. User not found.'
        });
      }

      // Check if user's role is authorized
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Role '${user.role}' is not authorized to access this resource.`
        });
      }

      next(); // User is authorized, continue

    } catch (error) {
      console.error('❌ Authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error in authorization'
      });
    }
  };
};

// Optional middleware to get user if token is present (but don't require it)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (user) {
          req.user = decoded;
        }
      } catch (jwtError) {
        // Token is invalid, but we don't throw error since auth is optional
        console.log('Optional auth: Invalid token provided');
      }
    }

    next(); // Continue regardless of token validity

  } catch (error) {
    console.error('❌ Optional auth error:', error);
    next(); // Continue even if there's an error
  }
};