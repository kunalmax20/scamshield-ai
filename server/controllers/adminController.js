import { User } from '../models/User.js';
import { Scan } from '../models/Scan.js';
import { Report } from '../models/Report.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getAdminStatistics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScans = await Scan.countDocuments();
    const totalReports = await Report.countDocuments();
    const verifiedScams = await Report.countDocuments({ status: 'VERIFIED' });
    const pendingReports = await Report.countDocuments({ status: 'PENDING' });

    // Category breakdown across reported scams
    const categoryBreakdown = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return ApiResponse.success(
      res,
      'Admin statistics retrieved successfully',
      {
        totalUsers,
        totalScans,
        totalReports,
        verifiedScams,
        pendingReports,
        categoryBreakdown
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const getAdminReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('userId', 'name email')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    return ApiResponse.success(
      res,
      'Admin reports fetched successfully',
      { count: reports.length, reports },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      return ApiResponse.error(res, 'Report record not found', 404);
    }

    report.status = status;
    report.verifiedBy = req.user._id;
    await report.save();

    return ApiResponse.success(
      res,
      `Report status updated to ${status}`,
      { report },
      200
    );
  } catch (error) {
    next(error);
  }
};
