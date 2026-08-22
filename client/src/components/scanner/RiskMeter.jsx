import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, AlertCircle } from 'lucide-react';

export default function RiskMeter({ score, level }) {
  const getRiskConfig = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return {
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400',
          barColor: 'bg-red-500',
          icon: ShieldAlert,
          badge: 'CRITICAL RISK'
        };
      case 'HIGH':
        return {
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          textColor: 'text-orange-400',
          barColor: 'bg-orange-500',
          icon: AlertTriangle,
          badge: 'HIGH RISK'
        };
      case 'MEDIUM':
        return {
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-400',
          barColor: 'bg-amber-500',
          icon: AlertCircle,
          badge: 'MEDIUM RISK'
        };
      default:
        return {
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          textColor: 'text-emerald-400',
          barColor: 'bg-emerald-500',
          icon: CheckCircle,
          badge: 'LOW RISK'
        };
    }
  };

  const config = getRiskConfig(level);
  const Icon = config.icon;

  return (
    <div className={`p-6 rounded-2xl border ${config.bgColor} ${config.borderColor} space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl bg-slate-950/60 border ${config.borderColor} ${config.textColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.borderColor} ${config.textColor} ${config.bgColor}`}>
              {config.badge}
            </span>
            <p className="text-xs text-slate-400 mt-1">Calibrated Threat Assessment</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline space-x-1">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${config.textColor}`}>
              {score}
            </span>
            <span className="text-slate-500 text-sm font-semibold">/ 100</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Risk Score</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-3 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${config.barColor}`}
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 (Safe)</span>
          <span>50 (Caution)</span>
          <span>100 (Critical)</span>
        </div>
      </div>
    </div>
  );
}
