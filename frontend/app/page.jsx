import Link from 'next/link';
import { Activity, ShieldCheck, Microscope, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navigation */}
      <nav className="w-full glass-panel py-4 px-6 flex justify-between items-center fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <Activity className="text-sky-400 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-white">DermXAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link 
            href="/register" 
            className="text-sm bg-sky-500 hover:bg-sky-400 text-white px-5 py-2 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(14,165,233,0.5)]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-sky-400 text-sm font-medium mb-4">
            <Microscope className="w-4 h-4" />
            <span>Next-Generation Dermatological Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-white">
            Skin Care Diagnostic <br />
            <span className="text-gradient">Hospital System</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Empowering doctors and patients with Explainable AI predictions, interactive 3D lesion mapping, and comprehensive Electronic Health Records.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/login" 
              className="group flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] w-full sm:w-auto"
            >
              Enter Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="flex items-center justify-center gap-2 glass-card px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800/80 transition-all w-full sm:w-auto text-white"
            >
              Explore Features
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-32">
          <div className="glass-card p-8 rounded-2xl flex flex-col items-start text-left">
            <div className="bg-sky-500/20 p-4 rounded-xl mb-6">
              <Microscope className="text-sky-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Explainable AI</h3>
            <p className="text-slate-400">
              Advanced PyTorch models provide disease predictions with Grad-CAM heatmaps so doctors understand exactly why a diagnosis was made.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-2xl flex flex-col items-start text-left">
            <div className="bg-indigo-500/20 p-4 rounded-xl mb-6">
              <Activity className="text-indigo-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">3D Body Mapping</h3>
            <p className="text-slate-400">
              Interactive 3D human body visualization for precise lesion mapping, severity tracking, and patient education.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl flex flex-col items-start text-left">
            <div className="bg-emerald-500/20 p-4 rounded-xl mb-6">
              <ShieldCheck className="text-emerald-400 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Role-Based Access</h3>
            <p className="text-slate-400">
              Secure, distinct environments for Patients, Doctors, and Admins. Complete EHR integration with strict data privacy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
