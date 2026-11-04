'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import BodySelector from '@/components/BodySelector';
import IntakeForm from '@/components/IntakeForm';
import ClinicalDashboard from '@/components/ClinicalDashboard';

export default function Test3DPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handleSelectLocation = (data) => {
    if (isSubmitted) return;
    const loc = typeof data === 'string' ? data : data?.partName || 'Torso';
    setSelectedLocation(loc);
  };

  const handleFormSubmit = (data) => {
    setMetadata(data);
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#306CE9', '#10b981'],
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMetadata(null);
    setImagePreview(null);
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="p-2 bg-[#306CE9] rounded-xl text-white flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest text-white uppercase">DermXAI</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 uppercase tracking-widest font-mono">3D HEALTH RADAR</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block">ANATOMICAL LESION MAPPING & CLINICAL TRIAGE</span>
          </div>
        </div>

        <Link
          href="/patient/dashboard"
          className="text-xs font-semibold px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          Patient Portal →
        </Link>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1">
          {/* Left: 3D Body Viewer */}
          <div className="lg:col-span-5 h-[550px] lg:h-auto flex flex-col">
            <BodySelector onSelect={handleSelectLocation} />
          </div>

          {/* Right: Intake / Results */}
          <div className="lg:col-span-7 flex flex-col">
            {!isSubmitted ? (
              <IntakeForm
                selectedLocation={selectedLocation}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                onSubmit={handleFormSubmit}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
              />
            ) : (
              <ClinicalDashboard
                metadata={metadata}
                imagePreview={imagePreview}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
