import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '7d'
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return ApiResponse.error(res, 'User with this email already exists', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User (First registered user is made admin for convenience if desired, default 'user')
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role
    });

    const token = generateToken(user._id);

    return ApiResponse.success(
      res,
      'User registered successfully',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    return ApiResponse.success(
      res,
      'Logged in successfully',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return ApiResponse.error(res, 'Not authenticated', 401);
    }

    return ApiResponse.success(
      res,
      'User profile fetched successfully',
      {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          createdAt: req.user.createdAt
        }
      },
      200
    );
  } catch (error) {
    next(error);
  }
};
