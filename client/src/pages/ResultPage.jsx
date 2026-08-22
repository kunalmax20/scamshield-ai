import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ResultCard from '../components/scanner/ResultCard';
import { scanService } from '../services/scanService';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScanResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await scanService.getScanById(id);
        setResult(response.data.scan);
      } catch (err) {
        setError(err.response?.data?.message || 'Scan report not found.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchScanResult();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <Link
          to="/scan"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>
        <span className="text-xs font-mono text-slate-500">Report ID: {id}</span>
      </div>

      {loading ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-400" />
          <p className="text-sm font-medium">Fetching Scan Report Details...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <ResultCard result={result} />
      )}

    </div>
  );
}
