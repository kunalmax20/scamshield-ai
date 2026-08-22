import React, { useState } from 'react';
import { Link, Zap } from 'lucide-react';

export default function UrlScanner({ onScan, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim().length >= 3) {
      onScan(url.trim());
    }
  };

  const sampleUrls = [
    'https://sbi-kyc-verify.com/login',
    'https://fake-paytm-reward.xyz/claim',
    'https://google.com'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Enter Suspicious URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Link className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://sbi-kyc-verify-update.com/login"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 text-sm transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo URLs:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleUrls.map((u, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setUrl(u)}
              className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition-colors font-medium font-mono"
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || url.trim().length < 3}
        className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-sky-500/10 flex items-center justify-center space-x-2"
      >
        <Link className="w-4 h-4" />
        <span>{loading ? 'Analyzing URL...' : 'Analyze URL'}</span>
      </button>
    </form>
  );
}
