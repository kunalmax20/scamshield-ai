import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, ArrowRight, CheckCircle2, MessageSquare, Image, Link as LinkIcon, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-12">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs font-semibold text-sky-400">
          <Shield className="w-4 h-4" />
          <span>Next-Gen Cybersecurity & Explainable AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Protect Yourself From <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-300">
            Digital Scams & Fraud
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Instantly detect malicious messages, suspicious URLs, and screenshot scams. ScamShield AI explains <strong className="text-slate-200">why</strong> a message is dangerous and tells you <strong className="text-slate-200">what to do next</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/scan"
            className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2 text-sm"
          >
            <span>Scan Message Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl transition-all text-sm"
          >
            Learn How It Works
          </a>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Core Detection Capabilities</h2>
          <p className="text-xs text-slate-400">Hybrid Rule Engine + Explainable AI Threat Intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl w-fit">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Message Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes raw SMS, WhatsApp, and email text using deterministic rules and contextual AI models for banking and UPI fraud.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl w-fit">
              <Image className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Screenshot OCR Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload chat screenshots. Tesseract OCR extracts embedded text and automatically passes it through our threat detection engine.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl w-fit">
              <LinkIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">URL Risk Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parses suspicious links, IP-based URLs, domain spoofing, and brand impersonations (e.g. fake SBI/HDFC/Paytm domains).
            </p>
          </div>

        </div>
      </section>

      {/* India Fraud Focus Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Tailored for Modern Fraud Patterns</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Specialized Detection for Hindi & Hinglish Scams
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Supports code-switching Indian languages: Fake KYC, Electricity disconnection threats, UPI PIN traps, and lottery scams (e.g. <span className="font-mono text-slate-300 font-medium">"Apka bank account band hone wala hai"</span>).
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Link
              to="/scan"
              className="w-full sm:w-auto px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2"
            >
              <span>Try Live Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
