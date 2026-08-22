import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'sky' }) {
  const colorMap = {
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  const style = colorMap[color] || colorMap.sky;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl border ${style}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-0.5">
        <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
