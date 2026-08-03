'use client';

import { useState } from 'react';
import { UploadCloud, ShieldAlert, CheckCircle2, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function DoctorXAIAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showGrokModal, setShowGrokModal] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // reset
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const localRes = await fetch(`${backendUrl}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!localRes.ok) throw new Error('Network response was not ok');
      const data = await localRes.json();
      setResult(data);

    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Make sure the FastAPI backend is running on port 8000.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Standalone XAI Tool</h1>
        <p className="text-gray-500 mt-1">Upload clinical images directly for instant AI analysis and Grok research.</p>
      </div>

      <div className="glass-card rounded-2xl p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-[#306CE9] w-6 h-6" />
            Diagnostic Engine
          </h2>
        </div>
        
        {!previewUrl && !result ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#306CE9]/30 rounded-xl bg-blue-50/50 p-12 text-center hover:bg-blue-50 transition-all min-h-[300px]">
            <UploadCloud className="w-16 h-16 text-[#306CE9] mb-4" />
            <p className="text-gray-900 font-bold text-lg mb-1">Upload Clinical Lesion Image</p>
            <p className="text-sm text-gray-500 mb-6">PNG, JPG up to 10MB</p>
            <label className="bg-[#306CE9] hover:bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-colors font-bold shadow-lg shadow-blue-500/20">
              Browse Local Files
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        ) : !result ? (
          <div className="flex flex-col gap-6">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-black/50 border border-gray-200">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold transition-colors"
              >
                Clear Image
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-[2] py-3 px-4 rounded-xl bg-[#306CE9] hover:bg-blue-600 text-white font-bold transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
              >
                {isAnalyzing ? 'Running AI Engine...' : 'Run Diagnostics'}
              </button>
            </div>
          </div>
        ) : null}

        {/* Results Area */}
        {result && (
          <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-50 mt-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Analysis Complete
                </h3>
                <p className="text-blue-700 font-bold text-lg">Predicted: {result.disease} ({result.confidence}%)</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">{result.explanation}</p>
            
            <button
              onClick={() => setShowGrokModal(true)}
              className="w-full mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              View Grok AI Detailed Analysis
            </button>

            <div className="border-t border-gray-200/50 pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Grad-CAM Heatmap Analysis</h4>
              <img src={`data:image/jpeg;base64,${result.heatmap_base64}`} alt="Heatmap" className="w-full max-h-96 object-contain rounded-xl border border-gray-200 shadow-inner" />
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200/50 flex justify-end">
              <button 
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResult(null); }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grok AI Modal Popup */}
      {showGrokModal && result?.detailed_research && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Grok AI Clinical Research Report
              </h2>
              <button 
                onClick={() => setShowGrokModal(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grok-markdown text-gray-800 space-y-4">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-2xl font-black text-indigo-900 mt-6 mb-3 border-b-2 border-indigo-100 pb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-600 leading-relaxed mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="marker:text-indigo-400" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                }}
              >
                {result.detailed_research}
              </ReactMarkdown>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 p-4 shrink-0 flex justify-end">
              <button
                onClick={() => setShowGrokModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
