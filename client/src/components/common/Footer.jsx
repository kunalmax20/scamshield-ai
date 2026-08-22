import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-slate-500 text-xs">
        
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-sky-500" />
          <span className="font-semibold text-slate-300">ScamShield AI</span>
          <span>— Hackathon Cybersecurity & Explainable AI Platform</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-400">
          <span>Message Scanner</span>
          <span>•</span>
          <span>OCR Screenshot Analyzer</span>
          <span>•</span>
          <span>URL Risk Engine</span>
        </div>

      </div>
    </footer>
  );
}
