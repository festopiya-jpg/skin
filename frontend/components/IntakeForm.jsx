'use client';

import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, FileImage, ShieldAlert, User, Calendar, Activity, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

// Realistic synthetic polarized dermoscopy lesion image for instant viva demos
const SAMPLE_LESION_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><defs><radialGradient id="skin" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ecc2a8"/><stop offset="100%" stop-color="%23c58b69"/></radialGradient><radialGradient id="core" cx="42%" cy="38%" r="48%"><stop offset="0%" stop-color="%23120703"/><stop offset="35%" stop-color="%233a180b"/><stop offset="68%" stop-color="%23753617"/><stop offset="88%" stop-color="%23aa5424"/><stop offset="100%" stop-color="%23d08557" stop-opacity="0"/></radialGradient><filter id="irregular"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter></defs><rect width="500" height="500" fill="url(%23skin)"/><g filter="url(%23irregular)"><path d="M 230,120 C 330,130 400,190 380,290 C 350,380 270,410 190,390 C 110,360 90,270 130,190 C 160,140 180,110 230,120 Z" fill="url(%23core)" opacity="0.96"/></g><circle cx="260" cy="220" r="18" fill="%23050201" opacity="0.85"/><circle cx="190" cy="280" r="22" fill="%23260c04" opacity="0.85"/><circle cx="310" cy="300" r="15" fill="%23481e09" opacity="0.75"/><circle cx="250" cy="250" r="230" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-dasharray="8,6" opacity="0.45"/><text x="24" y="475" fill="%23ffffff" font-family="monospace" font-size="13" font-weight="bold" opacity="0.9">POLARIZED DERMOSCOPY • 10x OPTICAL ZOOM • SCALE: 1mm/div</text></svg>`;

export default function IntakeForm({
  selectedLocation,
  imagePreview,
  setImagePreview,
  onSubmit,
  onSelectLocation,
}) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Select Gender');
  const [duration, setDuration] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [demoLoaded, setDemoLoaded] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleLoadDemoCase = () => {
    setName('Eleanor Vance');
    setAge('48');
    setGender('Female');
    setDuration('6 weeks (asymmetrical enlargement)');
    setSymptoms('Asymmetrical pigment border with central dark core. Mild intermittent pruritus. No bleeding upon mechanical contact.');
    setImagePreview(SAMPLE_LESION_IMAGE);
    setError(null);
    setDemoLoaded(true);
    
    // If no location has been mapped yet, default to Torso
    if (!selectedLocation && onSelectLocation) {
      onSelectLocation('Torso');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, or WEBP).');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      setError('Anatomical location selection is required. Please click on the 3D model to select the location.');
      return;
    }
    
    if (!imagePreview) {
      setError('A skin lesion close-up photo is required. Please drag and drop or upload an image.');
      return;
    }

    if (!name.trim()) {
      setError('Patient name is required.');
      return;
    }

    if (!age || isNaN(Number(age))) {
      setError('Please enter a valid age.');
      return;
    }

    setError(null);
    onSubmit({
      name,
      age: Number(age),
      gender: gender === 'Select Gender' ? 'Not specified' : gender,
      duration: duration || 'Not specified',
      symptoms: symptoms || 'No additional symptoms reported',
      selectedLocation,
    });
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 lg:p-8 flex flex-col h-full shadow-2xl justify-between overflow-y-auto">
      <div>
        {/* Header with Demo Case quick loader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 border border-cyan-500/20 rounded-xl text-cyan-400">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Patient Intake Portal</h1>
              <p className="text-xs text-slate-400">Step 1: Record demographics, upload photo, and map lesion location.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLoadDemoCase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-cyan-950/30"
            title="Load sample clinical presentation for viva / review demo"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>⚡ Load Demo Case</span>
          </button>
        </div>

        {demoLoaded && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Sample clinical case loaded successfully for demonstration.</span>
            </div>
            <button
              type="button"
              onClick={() => setDemoLoaded(false)}
              className="text-emerald-400 hover:text-emerald-200 font-mono text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Validation Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Model selection helper warning if no location selected */}
          {!selectedLocation && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 text-sm flex items-start gap-2.5">
              <ShieldAlert size={18} className="flex-shrink-0 mt-0.5 text-cyan-400 animate-pulse" />
              <div>
                <span className="font-semibold block mb-0.5">Anatomical Mapping Required</span>
                <span className="text-xs text-slate-400">Please interact with the 3D mannequin in the left panel to select where the lesion is located (Head, Torso, Arms, Legs).</span>
              </div>
            </div>
          )}

          {/* Demographics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User size={13} className="text-slate-500" />
                Patient Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-500" />
                  Age
                </label>
                <input
                  type="number"
                  placeholder="e.g. 48"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-all duration-200 outline-none appearance-none cursor-pointer"
                >
                  <option disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock size={13} className="text-slate-500" />
                Duration of Lesion
              </label>
              <input
                type="text"
                placeholder="e.g., 3 weeks, 2 months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                Selected Location
              </label>
              <div className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold tracking-wide flex items-center justify-between ${
                selectedLocation
                  ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500'
              }`}>
                <span>{selectedLocation ? `Mapped: ${selectedLocation}` : 'No location selected'}</span>
                {selectedLocation && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    3D Locked
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Clinical Notes & Symptoms (Optional)
            </label>
            <textarea
              placeholder="Describe symptoms, e.g., itching, bleeding, rapid change in size or color..."
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 outline-none resize-none"
            />
          </div>

          {/* File Upload Zone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Skin Lesion Close-Up Photo
            </label>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 min-h-[140px] ${
                dragActive
                  ? 'border-cyan-500 bg-cyan-950/20'
                  : imagePreview
                  ? 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="flex items-center gap-4 w-full px-2" onClick={(e) => e.stopPropagation()}>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-slate-200 block truncate flex items-center gap-1.5">
                      <FileImage size={13} className="text-cyan-400" />
                      lesion_magnification_sample.png
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-mono">Dermoscopic image analyzed & ready</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                    }}
                    className="text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-950/40 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-2.5 rounded-full bg-slate-900 border border-slate-850 text-slate-400">
                    <Upload size={18} className={dragActive ? 'animate-bounce text-cyan-400' : ''} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-300">
                      Drag & drop image, or <span className="text-cyan-400 hover:underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Accepts PNG, JPG, or WEBP dermatoscopy scans.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Submit Button Section */}
      <div className="border-t border-slate-850 pt-5 mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
            selectedLocation && imagePreview
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-950/50 hover:shadow-cyan-500/20 active:scale-[0.98]'
              : 'bg-slate-800 border border-slate-750 text-slate-500 cursor-not-allowed'
          }`}
          disabled={!selectedLocation || !imagePreview}
        >
          Generate Diagnostic Dashboard
        </button>
      </div>
    </div>
  );
}
