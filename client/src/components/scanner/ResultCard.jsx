import React from 'react';
import RiskMeter from './RiskMeter';
import SignalList from './SignalList';
import { ShieldCheck, Info, ShieldAlert, Link as LinkIcon, Flag, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResultCard({ result }) {
  if (!result) return null;

  const {
    id,
    inputType,
    isScam,
    riskScore,
    riskLevel,
    category,
    signals,
    explanation,
    recommendation,
    urls,
    originalText,
    extractedText,
    ocrConfidence
  } = result;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
      
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-800 gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {inputType === 'IMAGE' ? 'Screenshot OCR Analysis' : 'Scan Analysis'}
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            {isScam ? (
              <span className="text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5" /> Threat Detected
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5" /> Appears Low Risk
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono font-medium">
            Category: <strong className="text-sky-400">{category?.replace('_', ' ')}</strong>
          </span>
        </div>
      </div>

      {/* OCR Extracted Text Section if image input */}
      {extractedText && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> OCR Extracted Text from Screenshot
            </span>
            {ocrConfidence > 0 && (
              <span className="text-[10px] font-mono text-slate-500">
                Confidence: {Math.round(ocrConfidence)}%
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed max-h-40 overflow-y-auto">
            {extractedText}
          </p>
        </div>
      )}

      {/* Risk Gauge */}
      <RiskMeter score={riskScore} level={riskLevel} />

      {/* Extracted URLs Section if present */}
      {urls && urls.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-sky-400" /> Extracted URLs ({urls.length})
          </span>
          <div className="space-y-1">
            {urls.map((u, idx) => (
              <div key={idx} className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg truncate">
                {u}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Threat Signals */}
      <SignalList signals={signals} />

      {/* Explainable AI Analysis */}
      <div className="space-y-4 pt-2">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Explainable AI Reasoning (Why Suspicious)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {explanation}
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Actionable Safety Recommendation
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {recommendation}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      {id && (
        <div className="pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <span className="text-[11px] font-mono text-slate-500">Scan ID: {id}</span>
          <div className="flex items-center space-x-2">
            <Link
              to="/report"
              state={{ message: extractedText || originalText, category }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>Report to Community</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
