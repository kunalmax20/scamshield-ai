import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { ShieldAlert, Users, Search, Flag, CheckCircle, XCircle, RefreshCw, AlertCircle, Clock } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await adminService.getStatistics();
      setStats(statsRes.data);

      const reportsRes = await adminService.getReports(statusFilter);
      setReports(reportsRes.data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await adminService.updateReportStatus(id, newStatus);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin & Moderator Workspace</h1>
            <p className="text-xs text-slate-400">Review community reports, verify active threat campaigns, and monitor platform health</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm font-medium">Loading admin controls & MongoDB Atlas metrics...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* High-level Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
                <Users className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-3xl font-bold text-white font-mono">{stats?.totalUsers || 0}</h3>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total System Scans</span>
                <Search className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-bold text-white font-mono">{stats?.totalScans || 0}</h3>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Community Reports</span>
                <Flag className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-3xl font-bold text-white font-mono">{stats?.totalReports || 0}</h3>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Scams</span>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-400 font-mono">{stats?.verifiedScams || 0}</h3>
            </div>
          </div>

          {/* Report Moderation Workspace */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Community Scam Reports Review</h3>
                <p className="text-xs text-slate-400">Review user-submitted fraud reports and mark them as verified threats</p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      statusFilter === st
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports List */}
            {reports.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 font-mono">
                No reports matching filter status '{statusFilter}'.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div key={rep._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-sky-400 font-mono bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
                          {rep.category?.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Submitted by: <strong className="text-slate-300">{rep.userId?.name || 'Anonymous User'}</strong>
                        </span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold w-fit ${
                        rep.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        rep.status === 'REJECTED' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Reported Message</span>
                      <p className="text-xs font-mono text-slate-200">{rep.message}</p>
                    </div>

                    <p className="text-xs text-slate-400 italic">User Reason: {rep.reason}</p>

                    {/* Action Controls for Moderator */}
                    {rep.status === 'PENDING' && (
                      <div className="pt-2 flex items-center justify-end space-x-2">
                        <button
                          disabled={updatingId === rep._id}
                          onClick={() => handleStatusUpdate(rep._id, 'VERIFIED')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 shadow-md shadow-emerald-500/10"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Verify Scam</span>
                        </button>
                        <button
                          disabled={updatingId === rep._id}
                          onClick={() => handleStatusUpdate(rep._id, 'REJECTED')}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>Reject Report</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}
