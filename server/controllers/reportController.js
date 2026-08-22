import { Report } from '../models/Report.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createReport = async (req, res, next) => {
  try {
    const { scanId, message, category, reason } = req.body;
    const userId = req.user ? req.user._id : null;

    const report = await Report.create({
      userId,
      scanId: scanId || null,
      message,
      category,
      reason,
      status: 'PENDING'
    });

    return ApiResponse.success(
      res,
      'Scam report submitted to community database successfully',
      { report },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reports = await Report.find({ userId }).sort({ createdAt: -1 });

    return ApiResponse.success(
      res,
      'User community reports fetched successfully',
      { count: reports.length, reports },
      200
    );
  } catch (error) {
    next(error);
  }
};
