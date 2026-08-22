import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { AuthContext } from '../context/AuthContext';
import { Flag, Send, CheckCircle2, AlertCircle, RefreshCw, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function ReportPage() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const prefilledMessage = location.state?.message || '';
  const prefilledCategory = location.state?.category || 'BANKING_SCAM';

  const [message, setMessage] = useState(prefilledMessage);
  const [category, setCategory] = useState(prefilledCategory);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [myReports, setMyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const categories = [
    { value: 'BANKING_SCAM', label: 'Banking Scam' },
    { value: 'PHISHING', label: 'Phishing Link' },
    { value: 'UPI_SCAM', label: 'UPI / Payment Scam' },
    { value: 'OTP_SCAM', label: 'OTP / PIN Theft' },
    { value: 'JOB_SCAM', label: 'Job / Work-from-Home Scam' },
    { value: 'LOTTERY_SCAM', label: 'Lottery / Prize Fraud' },
    { value: 'DELIVERY_SCAM', label: 'Courier / Package Scam' },
    { value: 'INVESTMENT_SCAM', label: 'Crypto / Investment Fraud' },
    { value: 'GOVERNMENT_IMPERSONATION', label: 'Government / Police Impersonation' },
    { value: 'TECH_SUPPORT_SCAM', label: 'Tech Support Scam' },
    { value: 'ROMANCE_SCAM', label: 'Romance / Dating Scam' },
    { value: 'OTHER', label: 'Other Fraud' }
  ];

  const fetchMyReports = async () => {
    if (!user) return;
    setLoadingReports(true);
    try {
      const response = await reportService.getMyReports();
      setMyReports(response.data.reports || []);
    } catch (err) {
      console.warn('[ReportPage] Could not load user reports:', err.message);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await reportService.createReport({
        message: message.trim(),
        category,
        reason: reason.trim()
      });

      setSuccess(true);
      setMessage('');
      setReason('');
      fetchMyReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit scam report.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded text-xs font-semibold font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> VERIFIED SCAM
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-0.5 rounded text-xs font-semibold font-mono flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded text-xs font-semibold font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" /> PENDING REVIEW
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl w-fit mx-auto">
          <Flag className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Report a Scam to Community</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Submit suspicious messages, URLs, or fraud attempts to help build our community threat database.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Thank you! Your scam report has been submitted to the community database for admin review.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Scam Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-sky-500/50"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Suspicious Message Content or URL
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste the suspicious text, link, or scam details here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Reason for Reporting
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you believe this is a scam? (e.g. Impersonated SBI bank, requested OTP, fake courier fee...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || message.trim().length < 5 || reason.trim().length < 5}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Submitting Report...' : 'Submit Scam Report'}</span>
          </button>

        </form>
      </div>

      {/* User's Submitted Community Reports */}
      {user && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white tracking-tight">Your Submitted Community Reports</h3>
            <button onClick={fetchMyReports} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium">
              <RefreshCw className={`w-3 h-3 ${loadingReports ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {myReports.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-500 font-mono">
              You have not submitted any community reports yet.
            </div>
          ) : (
            <div className="space-y-3">
              {myReports.map((rep) => (
                <div key={rep._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-300 font-mono">{rep.category.replace('_', ' ')}</span>
                    {getStatusBadge(rep.status)}
                  </div>
                  <p className="text-xs text-slate-400 font-sans line-clamp-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    "{rep.message}"
                  </p>
                  <p className="text-[11px] text-slate-500 italic">Reason: {rep.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
