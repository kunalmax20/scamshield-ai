import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';

export default function TextScanner({ onScan, loading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length >= 3) {
      onScan(text.trim());
    }
  };

  const sampleMessages = [
    {
      label: 'Banking Scam (SBI)',
      text: 'Your SBI account will be blocked today. Complete KYC immediately using this link: https://sbi-kyc-verify.com'
    },
    {
      label: 'Hinglish KYC Scam',
      text: 'Apka bank account band hone wala hai. Immediately click this link to update KYC: https://fake-bank-update.xyz'
    },
    {
      label: 'UPI Lottery Scam',
      text: 'Congratulations! You won ₹50,000 cash reward from Paytm. Claim your prize immediately by sharing your UPI PIN.'
    },
    {
      label: 'Safe Message',
      text: 'Hi Ramesh, let us meet today at 5 PM for tea near the office.'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Paste Suspicious Message
        </label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste SMS, WhatsApp, Email, or Telegram message here (e.g. 'Your SBI account will be blocked today. Click link to update KYC...')"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 text-sm transition-all resize-none"
        />
      </div>

      {/* Sample Quick Fill Buttons for Hackathon Demo */}
      <div className="space-y-2">
        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setText(sample.text)}
              className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition-colors font-medium"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || text.trim().length < 3}
        className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-sky-500/10 flex items-center justify-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Analyzing Threats...' : 'Analyze Message'}</span>
      </button>
    </form>
  );
}
