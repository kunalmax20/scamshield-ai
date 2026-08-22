import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scanService } from '../services/scanService';
import { History, Search, ShieldAlert, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Filter } from 'lucide-react';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await scanService.getScanHistory();
      setScans(response.data.scans || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load scan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded font-mono text-xs font-bold">CRITICAL</span>;
      case 'HIGH':
        return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded font-mono text-xs font-bold">HIGH</span>;
      case 'MEDIUM':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-mono text-xs font-bold">MEDIUM</span>;
      default:
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded font-mono text-xs font-bold">LOW</span>;
    }
  };

  const filteredScans = scans.filter((scan) => {
    const matchesRisk = riskFilter === 'ALL' || scan.riskLevel === riskFilter;
    const matchesSearch =
      !searchQuery ||
      scan.originalText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-2xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Scan History</h1>
            <p className="text-xs text-slate-400">View and audit all your historical scam analysis reports</p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword or category..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>

        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Risk:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                riskFilter === lvl
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-medium">Loading your scan logs...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 text-slate-400">
          <History className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-semibold text-slate-300">No Scan History Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || riskFilter !== 'ALL'
              ? 'No scans match your active search filters.'
              : 'You have not performed any scans yet. Scans performed while signed in will appear here.'}
          </p>
          <Link
            to="/scan"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl transition-colors mt-2"
          >
            <span>Scan Message Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Message Snippet</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4 text-right">Score</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredScans.map((scan) => (
                  <tr key={scan._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(scan.createdAt).toLocaleDateString()} {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[11px] text-sky-400">
                        {scan.inputType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200 whitespace-nowrap">
                      {scan.category?.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {scan.originalText}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRiskBadge(scan.riskLevel)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                      {scan.riskScore}/100
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Link
                        to={`/result/${scan._id}`}
                        className="px-3 py-1 bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 text-slate-300 text-xs font-semibold rounded-lg transition-colors inline-flex items-center space-x-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
