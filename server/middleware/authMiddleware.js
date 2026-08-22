import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, 'Not authorized, no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return ApiResponse.error(res, 'User associated with token no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Not authorized, token invalid or expired', 401);
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch (error) {
      // Ignore token failure for optional auth endpoints
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};
