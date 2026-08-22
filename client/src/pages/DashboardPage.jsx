import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import RiskChart from '../components/dashboard/RiskChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import ActivityChart from '../components/dashboard/ActivityChart';
import { dashboardService } from '../services/dashboardService';
import { LayoutDashboard, Search, ShieldAlert, ShieldCheck, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getStats();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-2xl">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Security Analytics Dashboard</h1>
            <p className="text-xs text-slate-400">Real-time scam metrics, category breakdown, and threat trends</p>
          </div>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-medium">Aggregating threat metrics from MongoDB Atlas...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Scans"
              value={data?.metrics?.totalScans || 0}
              subtitle="Messages, Screenshots & URLs"
              icon={Search}
              color="sky"
            />
            <StatCard
              title="Scams Flagged"
              value={data?.metrics?.scamsDetected || 0}
              subtitle={`${data?.metrics?.scamPercentage || 0}% of all analyzed inputs`}
              icon={ShieldAlert}
              color="red"
            />
            <StatCard
              title="High / Critical Threats"
              value={data?.metrics?.highCriticalScans || 0}
              subtitle="Confirmed high-severity vectors"
              icon={ShieldAlert}
              color="orange"
            />
            <StatCard
              title="Safe Messages"
              value={data?.metrics?.safeScans || 0}
              subtitle="Legitimate messages verified"
              icon={ShieldCheck}
              color="emerald"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Risk Distribution Donut Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-400" /> Risk Level Distribution
              </h3>
              <RiskChart data={data?.riskDistribution} />
            </div>

            {/* Category Breakdown Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-purple-400" /> Top Scam Categories
              </h3>
              <CategoryChart data={data?.categoryDistribution} />
            </div>

          </div>

          {/* 7-Day Activity Trend Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-sky-400" /> 7-Day Scan Activity Trend
            </h3>
            <ActivityChart data={data?.activityOverTime} />
          </div>

          {/* Recent Scans Table */}
          {data?.recentScans && data.recentScans.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white tracking-tight">Recent Scans</h3>
                <Link to="/history" className="text-xs text-sky-400 hover:underline font-semibold flex items-center gap-1">
                  <span>View All History</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 border-b border-slate-800 uppercase font-semibold text-slate-500 tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Risk Level</th>
                      <th className="py-3 px-4 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {data.recentScans.map((scan) => (
                      <tr key={scan._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-sky-400">{scan.inputType}</td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{scan.category?.replace('_', ' ')}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                            scan.riskLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                            scan.riskLevel === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                            scan.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {scan.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">{scan.riskScore}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
