import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export default function ImageScanner({ onScan, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Invalid file type. Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('screenshot', selectedFile);
    onScan(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {!previewUrl ? (
        <label className="border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-950/50 hover:bg-slate-900/50 transition-all group">
          <div className="p-3 bg-slate-900 group-hover:bg-sky-500/10 rounded-xl text-slate-400 group-hover:text-sky-400 transition-colors mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-200">Upload Screenshot Image</p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
          <p className="text-xs text-slate-400 mt-3 font-medium">WhatsApp • SMS • Email • Telegram Screenshots</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-800" />
            <div>
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">{selectedFile?.name}</p>
              <p className="text-xs text-slate-500">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedFile}
        className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-sky-500/10 flex items-center justify-center space-x-2"
      >
        <ImageIcon className="w-4 h-4" />
        <span>{loading ? 'Processing OCR & Analysis...' : 'Analyze Screenshot'}</span>
      </button>
    </form>
  );
}
