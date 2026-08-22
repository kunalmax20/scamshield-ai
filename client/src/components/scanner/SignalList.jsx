import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignalList({ signals = [] }) {
  if (!signals || signals.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center space-x-3 text-emerald-400 text-xs">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>No malicious patterns or threat indicators detected in input.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Detected Threat Indicators ({signals.length})
      </h4>
      <div className="space-y-2">
        {signals.map((sig, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-red-500/20 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-red-300"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="font-medium">{sig}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
