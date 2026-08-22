import React from 'react';
import { MessageSquare, Image, Link } from 'lucide-react';

export default function ScannerTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'TEXT', label: 'Message Scanner', icon: MessageSquare },
    { id: 'IMAGE', label: 'Screenshot Scanner', icon: Image },
    { id: 'URL', label: 'URL Scanner', icon: Link }
  ];

  return (
    <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 space-x-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
