import React, { useState } from 'react';
import ScannerTabs from '../components/scanner/ScannerTabs';
import TextScanner from '../components/scanner/TextScanner';
import UrlScanner from '../components/scanner/UrlScanner';
import ImageScanner from '../components/scanner/ImageScanner';
import ResultCard from '../components/scanner/ResultCard';
import { scanService } from '../services/scanService';
import { Shield, AlertCircle } from 'lucide-react';

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState('TEXT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleScanText = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const response = await scanService.scanText(text);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanUrl = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await scanService.scanUrl(url);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanImage = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await scanService.scanImage(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan image screenshot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs font-semibold text-sky-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Explainable AI Scam Analysis Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ScamShield <span className="text-sky-400">AI Scanner</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Analyze suspicious text messages, URLs, or screenshots for phishing, banking fraud, and India-focused digital scams.
        </p>
      </div>

      {/* Scanner Mode Selector */}
      <ScannerTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setResult(null); setError(null); }} />

      {/* Error Banner if any */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scanner Input Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {activeTab === 'TEXT' && <TextScanner onScan={handleScanText} loading={loading} />}
        {activeTab === 'URL' && <UrlScanner onScan={handleScanUrl} loading={loading} />}
        {activeTab === 'IMAGE' && <ImageScanner onScan={handleScanImage} loading={loading} />}
      </div>

      {/* Live Result View */}
      {result && <ResultCard result={result} />}

    </div>
  );
}
