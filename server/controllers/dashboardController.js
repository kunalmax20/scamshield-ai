import { Scan } from '../models/Scan.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;

    // Filter by user if authenticated, or query global stats if guest demo
    const matchQuery = userId ? { userId } : {};

    // 1. High-level metric counts
    const totalScans = await Scan.countDocuments(matchQuery);
    const scamsDetected = await Scan.countDocuments({ ...matchQuery, isScam: true });
    const highCriticalScans = await Scan.countDocuments({
      ...matchQuery,
      riskLevel: { $in: ['HIGH', 'CRITICAL'] }
    });
    const safeScans = await Scan.countDocuments({ ...matchQuery, riskLevel: 'LOW' });

    // 2. Risk Distribution Grouping
    const riskDistributionRaw = await Scan.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
    ]);

    const riskDistribution = [
      { name: 'CRITICAL', count: 0, color: '#ef4444' },
      { name: 'HIGH', count: 0, color: '#f97316' },
      { name: 'MEDIUM', count: 0, color: '#f59e0b' },
      { name: 'LOW', count: 0, color: '#10b981' }
    ];

    riskDistributionRaw.forEach((item) => {
      const target = riskDistribution.find((r) => r.name === item._id);
      if (target) target.count = item.count;
    });

    // 3. Category Breakdown Grouping
    const categoryRaw = await Scan.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    const categoryDistribution = categoryRaw.map((item) => ({
      category: item._id ? item._id.replace('_', ' ') : 'OTHER',
      count: item.count
    }));

    // 4. Activity Over Time (Past 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const activityRaw = await Scan.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          scans: { $sum: 1 },
          scams: { $sum: { $cond: ['$isScam', 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing dates in 7-day timeline
    const activityOverTime = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = activityRaw.find((a) => a._id === dateStr);
      activityOverTime.push({
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        scans: match ? match.scans : 0,
        scams: match ? match.scams : 0
      });
    }

    // 5. Recent Scans (Top 5)
    const recentScans = await Scan.find(matchQuery)
      .sort({ createdAt: -1 })
      .limit(5);

    return ApiResponse.success(
      res,
      'Dashboard analytics fetched successfully',
      {
        metrics: {
          totalScans,
          scamsDetected,
          highCriticalScans,
          safeScans,
          scamPercentage: totalScans > 0 ? Math.round((scamsDetected / totalScans) * 100) : 0
        },
        riskDistribution,
        categoryDistribution,
        activityOverTime,
        recentScans
      },
      200
    );
  } catch (error) {
    next(error);
  }
};
