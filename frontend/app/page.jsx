'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, Shield, Siren, Phone, Calendar, Users, 
  MessageCircle, Menu, X, ChevronRight, Star, Heart, 
  Baby, Stethoscope, Bone, Pill, Microscope, Clock, Building2, Lock
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-16 md:pb-0">
      
      {/* 1. TOP HOSPITAL BANNER (Matching momhospital.in) */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            
            {/* Hospital Brand Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F4C81] to-[#306CE9] flex items-center justify-center text-white shadow-sm">
                <Shield className="w-6 h-6 fill-white/20 stroke-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-[#0F4C81]">DermXAI</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">MOM</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Multi-Speciality Hospital & Research Institute
                </span>
              </div>
            </Link>

            {/* Emergency 24/7 Hotline Badge */}
            <div className="flex items-center gap-6">
              <a 
                href="tel:+918912788999" 
                className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
              >
                <div className="p-1 bg-red-600 rounded-full text-white animate-pulse">
                  <Siren className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-[9px] uppercase font-black tracking-wider text-red-600 block leading-tight">Emergency 24/7</span>
                  <span className="text-xs font-bold text-gray-900 font-mono">+91 891 278 8999</span>
                </div>
                <span className="text-xs font-bold sm:hidden text-red-700 uppercase">Emergency</span>
              </a>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

          {/* Secondary Navigation Strip (Clean Uppercase Links) */}
          <nav className="hidden md:flex items-center gap-8 py-2.5 border-t border-gray-100 text-xs font-bold tracking-wider text-[#0F4C81] uppercase">
            <Link href="/" className="text-[#306CE9] border-b-2 border-[#306CE9] pb-0.5">Home</Link>
            <Link href="#about" className="hover:text-blue-700 transition-colors">About</Link>
            <Link href="#doctors" className="hover:text-blue-700 transition-colors">Doctors & Timings</Link>
            <Link href="#specialities" className="hover:text-blue-700 transition-colors">Specialities</Link>
            <Link href="/test-3d" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
              3D Health Radar
            </Link>
            <Link href="#reviews" className="hover:text-blue-700 transition-colors">Patient Reviews</Link>
            <div className="ml-auto flex items-center gap-3">
              <Link href="/login?portal=staff" className="text-gray-600 hover:text-gray-900 font-semibold normal-case text-xs">
                Staff Login
              </Link>
              <Link 
                href="/login?portal=patient" 
                className="bg-[#0F4C81] hover:bg-blue-900 text-white px-4 py-1.5 rounded-full text-xs font-bold normal-case shadow-sm transition-all"
              >
                Book Appointment
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 text-sm font-bold text-[#0F4C81]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-blue-600">Home</Link>
            <Link href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1">About Hospital</Link>
            <Link href="#doctors" onClick={() => setMobileMenuOpen(false)} className="block py-1">Doctors & Timings</Link>
            <Link href="#specialities" onClick={() => setMobileMenuOpen(false)} className="block py-1">Specialised Departments</Link>
            <Link href="/test-3d" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-blue-700">3D Anatomical Radar</Link>
            <Link href="#reviews" onClick={() => setMobileMenuOpen(false)} className="block py-1">Patient Reviews</Link>
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link href="/login?portal=staff" onClick={() => setMobileMenuOpen(false)} className="w-1/2 py-2 text-center text-xs border border-gray-300 rounded-lg text-gray-700">Staff Portal</Link>
              <Link href="/login?portal=patient" onClick={() => setMobileMenuOpen(false)} className="w-1/2 py-2 text-center text-xs bg-[#0F4C81] text-white rounded-lg">Book Appt</Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (Matching momhospital.in Screenshot 1) */}
      <section className="relative w-full min-h-[520px] md:min-h-[600px] flex items-center bg-slate-900 overflow-hidden">
        {/* Background Real Hospital Building Image */}
        <img 
          src="/hero.jpg" 
          alt="Hospital Building Frontage" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
        />
        {/* Warm Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10">
          <div className="max-w-2xl space-y-6">
            
            {/* Gold Kicker */}
            <div className="inline-block">
              <span className="text-[#D4A034] text-xs md:text-sm font-extrabold uppercase tracking-widest font-mono">
                NEW BENCHMARK IN HEALTHCARE
              </span>
            </div>

            {/* Classical Editorial Serif Headline */}
            <h1 className="font-serif-hospital text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-[1.15] tracking-tight">
              Advanced Care,<br />
              <span className="italic">Compassionate Hearts.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-normal">
              DermXAI Multi Speciality Hospital, Aganampudi — Dedicated to providing world-class medical services, 24/7 acute trauma care, and cutting-edge dermatopathology.
            </p>

            {/* Action Buttons (Matching Screenshot 1) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/login?portal=patient"
                className="bg-[#D4A034] hover:bg-[#c39129] text-slate-950 font-bold text-sm px-8 py-3.5 rounded-full text-center transition-all shadow-lg shadow-black/30 transform hover:-translate-y-0.5"
              >
                Book an Appointment
              </Link>
              <Link
                href="/test-3d"
                className="border-2 border-white/80 hover:border-white hover:bg-white/10 text-white font-semibold text-sm px-8 py-3 rounded-full text-center transition-all backdrop-blur-xs flex items-center justify-center gap-2"
              >
                <span>3D Health Radar</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SPECIALISED DEPARTMENTS (Matching momhospital.in Screenshot 2) */}
      <section id="specialities" className="py-20 bg-slate-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-[#D4A034] text-xs font-extrabold uppercase tracking-widest block font-mono">
              OUR EXPERTISE
            </span>
            <h2 className="font-serif-hospital text-3xl md:text-4xl font-normal text-[#0F4C81]">
              Specialised Departments
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              Comprehensive medical infrastructure with advanced clinical departments and 24/7 specialist availability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            
            {/* Department 1: Dermatology & Skin */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-[#306CE9] flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-serif-hospital font-semibold text-lg text-[#0F4C81] mb-2">
                Dermatology
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                AI-driven ABCDE lesion assessment and cutaneous oncology.
              </p>
            </div>

            {/* Department 2: Emergency */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 fill-red-100" />
              </div>
              <h3 className="font-serif-hospital font-semibold text-lg text-[#0F4C81] mb-2">
                Emergency 24/7
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                24/7 critical trauma and acute medical emergency support.
              </p>
            </div>

            {/* Department 3: Pathology Lab */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="font-serif-hospital font-semibold text-lg text-[#0F4C81] mb-2">
                Pathology Lab
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Punch biopsy histopathology and Fontana-Masson staining.
              </p>
            </div>

            {/* Department 4: Clinical Pharmacy */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-serif-hospital font-semibold text-lg text-[#0F4C81] mb-2">
                Pharmacy Desk
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                In-house dispensary fulfilling dermatologist prescriptions.
              </p>
            </div>

            {/* Department 5: Maternity */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="font-serif-hospital font-semibold text-lg text-[#0F4C81] mb-2">
                Maternity
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Comprehensive care for mother and child healthcare.
              </p>
            </div>

            {/* Department 6: Orthopedics */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <Bone className="w-6 h-6" />
              </div>
              <h3 className="font-serif-hospital font-semibold text-lg text-[#0F4C81] mb-2">
                Orthopedics
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Trauma, joint care, and musculoskeletal rehabilitation.
              </p>
            </div>

            {/* Department 7: Gen. Medicine */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-serif-hospital font-semibold text-lg text-[#0F4C81] mb-2">
                Gen. Medicine
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Holistic internal medicine and regular diagnostic check-ups.
              </p>
            </div>

            {/* Department 8: 3D Lesion Radar */}
            <div className="bg-gradient-to-br from-[#0F4C81] to-[#306CE9] p-6 rounded-2xl text-white shadow-sm flex flex-col items-center text-center justify-between">
              <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center mb-2">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-hospital font-semibold text-lg text-white mb-1">
                  3D Health Radar
                </h3>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  Interactive spatial anatomical lesion localization.
                </p>
              </div>
              <Link href="/test-3d" className="text-xs font-bold text-amber-300 hover:text-white mt-3 underline">
                Launch Radar →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PATIENT REVIEWS (Matching momhospital.in Screenshot 3) */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-[#D4A034] text-xs font-extrabold uppercase tracking-widest block font-mono">
              FEEDBACK
            </span>
            <h2 className="font-serif-hospital text-3xl md:text-4xl font-normal text-[#0F4C81]">
              Patient Reviews
            </h2>
            <p className="text-gray-500 text-xs">
              Latest verified reviews from Google
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                    G
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Gonthina Govindarao</h4>
                    <div className="flex text-amber-400 text-xs mt-0.5">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed italic">
                  "Good hospital, service is very good so I suggested MOM hospital. Doctors and nursing staff are very supportive and clinical triage was fast."
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center text-[11px] text-gray-400">
                <span className="text-[#306CE9] font-bold">Read on Google →</span>
                <span>Verified Patient</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
                    V
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Vimala Prasad</h4>
                    <div className="flex text-amber-400 text-xs mt-0.5">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed italic">
                  "It's only because of Dr. Sarah Mercer and the dermatology team that we caught the lesion early. The pathology biopsy report was released within hours."
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center text-[11px] text-gray-400">
                <span className="text-[#306CE9] font-bold">Read on Google →</span>
                <span>Verified Patient</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    K
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Kiran Kumar</h4>
                    <div className="flex text-amber-400 text-xs mt-0.5">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed italic">
                  "The 3D scanning and hospital pharmacy integration was super smooth. The doctor prescribed my ointment and pharmacy had it ready for pickup immediately."
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between items-center text-[11px] text-gray-400">
                <span className="text-[#306CE9] font-bold">Read on Google →</span>
                <span>Verified Patient</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LOOKING FOR AN EXPERT? (Matching momhospital.in Screenshot 4) */}
      <section id="doctors" className="py-20 bg-slate-50 border-t border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif-hospital text-3xl md:text-5xl font-normal text-[#0F4C81]">
            Looking for an Expert?
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            DermXAI Multi Speciality Hospital is home to some of the most eminent doctors in the region, dedicated to your well-being with advanced medical technology and multi-department support.
          </p>
          <div className="pt-2">
            <Link
              href="/login?portal=patient"
              className="inline-flex items-center gap-2 bg-[#0F4C81] hover:bg-blue-900 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-md"
            >
              <span>Book an Appointment</span>
              <span>→</span>
            </Link>
          </div>

          {/* Clinical Consultation Graphic */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center justify-center gap-6">
              <div className="text-left">
                <span className="text-xs font-bold text-[#306CE9] uppercase tracking-wider block">OPD Schedule</span>
                <h4 className="font-bold text-gray-900 text-base mt-0.5">Monday to Saturday: 9:00 AM – 8:00 PM</h4>
                <p className="text-xs text-gray-500 mt-1">24/7 Casualty, Emergency & Trauma Unit Open Everyday</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-[#306CE9] hidden sm:block">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOSPITAL FOOTER (Matching momhospital.in Screenshot 5) */}
      <footer className="bg-[#07213A] text-white pt-16 pb-24 md:pb-16 border-t border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-blue-900/60">
            
            {/* Column 1: Hospital Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">DermXAI Hospital</span>
              </div>
              <p className="text-blue-200/80 text-xs leading-relaxed">
                Mark's Oath Multi Speciality Hospital, Aganampudi, Visakhapatnam. Providing advanced cutaneous care, AI decision support, and 24/7 trauma response.
              </p>
              <p className="text-xs text-[#D4A034] font-semibold">
                Emergency: +91 891 278 8999
              </p>
            </div>

            {/* Column 2: Quick Links with Yellow Chevrons */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-blue-100">
                <li><Link href="#about" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-[#D4A034]" /> Insurance & Cashless TPA</Link></li>
                <li><Link href="#specialities" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-[#D4A034]" /> Health Blog & Clinical Articles</Link></li>
                <li><Link href="/login?portal=patient" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-[#D4A034]" /> Book Outpatient Appointment</Link></li>
                <li><Link href="/test-3d" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-[#D4A034]" /> 3D Anatomical Lesion Radar</Link></li>
                <li><Link href="/DermXAI_Project_Code_Guide.pdf" target="_blank" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-300 font-bold"><ChevronRight className="w-3 h-3 text-[#D4A034]" /> Technical Architecture PDF</Link></li>
              </ul>
            </div>

            {/* Column 3: Specialities */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Clinical Services</h4>
              <ul className="space-y-2 text-xs text-blue-100">
                <li>• Clinical Dermatology & Skin Oncology</li>
                <li>• Dermatopathology Biopsy Lab</li>
                <li>• 24/7 Emergency & Acute Trauma</li>
                <li>• Hospital Pharmacy & Dispensary</li>
                <li>• General Medicine & Outpatient</li>
              </ul>
            </div>

            {/* Column 4: FOR EMPLOYEES (Staff Login Card) */}
            <div>
              <h4 className="font-serif-hospital text-lg font-normal text-white mb-3">For Employees</h4>
              <Link 
                href="/login?portal=staff"
                className="bg-blue-900/40 hover:bg-blue-900/70 border border-blue-400/30 p-4 rounded-2xl flex items-center gap-3 transition-all group block shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">Staff Login</h5>
                  <p className="text-[11px] text-blue-200">Secure clinical login portal</p>
                </div>
              </Link>
              <p className="text-[10px] text-blue-300/60 mt-3 leading-relaxed">
                Dedicated access for Physicians, Clinical Pharmacists, Pathology Specialists, and Hospital Administration.
              </p>
            </div>

          </div>

          <div className="pt-8 text-center text-xs text-blue-300/70 space-y-1">
            <p>© 2026 DermXAI Multi-Speciality Hospital. All Rights Reserved.</p>
            <p className="text-[11px] text-blue-300/50">Designed with care for patient wellbeing • University Final Year Engineering Project</p>
          </div>
        </div>
      </footer>

      {/* 7. FIXED MOBILE BOTTOM NAVIGATION BAR (Exact replica of Screenshots 1 to 5) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50 flex items-center justify-around py-2 shadow-lg">
        
        <Link href="#doctors" className="flex flex-col items-center text-gray-600 hover:text-[#0F4C81]">
          <Stethoscope className="w-5 h-5 text-gray-500" />
          <span className="text-[10px] font-bold mt-1">Doctors</span>
        </Link>

        <Link href="/login?portal=patient" className="flex flex-col items-center text-gray-600 hover:text-[#0F4C81]">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-[10px] font-bold mt-1">Book Appt</span>
        </Link>

        <Link href="/test-3d" className="flex flex-col items-center text-[#306CE9]">
          <div className="p-2 -mt-5 bg-[#306CE9] rounded-full text-white shadow-md border-2 border-white">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 text-[#306CE9]">3D Scan</span>
        </Link>

        <a href="tel:+918912788999" className="flex flex-col items-center text-gray-600 hover:text-[#0F4C81]">
          <Phone className="w-5 h-5 text-gray-500" />
          <span className="text-[10px] font-bold mt-1">Call Us</span>
        </a>

        <Link href="/login?portal=staff" className="flex flex-col items-center text-gray-600 hover:text-[#0F4C81]">
          <Lock className="w-5 h-5 text-gray-500" />
          <span className="text-[10px] font-bold mt-1">Staff Portal</span>
        </Link>

      </div>

    </div>
  );
}
