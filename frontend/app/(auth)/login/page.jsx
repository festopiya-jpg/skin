'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Activity, Mail, Lock, Loader2, UserCheck, ShieldCheck, 
  Stethoscope, Pill, Microscope, AlertCircle, Check, ArrowRight, Shield 
} from 'lucide-react';
import { verifyUserCredentials, DEFAULT_USERS } from '@/lib/hospitalStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPortal = searchParams.get('portal') || searchParams.get('tab') || 'patient';
  
  const [activePortal, setActivePortal] = useState(initialPortal === 'staff' ? 'staff' : 'patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [helperNotice, setHelperNotice] = useState('');

  useEffect(() => {
    const p = searchParams.get('portal') || searchParams.get('tab');
    if (p === 'staff') {
      setActivePortal('staff');
    } else if (p === 'patient') {
      setActivePortal('patient');
    }
  }, [searchParams]);

  // Quick fill helper chips for evaluation
  const fillCredentials = (preset) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setErrorMessage('');
    setHelperNotice(`Loaded credentials for ${preset.name}. Click "Sign In" below.`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setHelperNotice('');

    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanEmail || !cleanPass) {
        setErrorMessage('Please enter both email address and password.');
        setIsLoading(false);
        return;
      }

      const res = verifyUserCredentials(cleanEmail, cleanPass);

      if (!res.success) {
        if (res.error === 'PENDING_APPROVAL') {
          setErrorMessage(`⛔ Account Pending Admin Approval. Your ${res.user.role.toUpperCase()} account has not yet been approved by the Hospital Administrator (waheeddeveloper@gmail.com). Please wait for Admin approval before signing in.`);
        } else if (res.error === 'SUSPENDED') {
          setErrorMessage('⛔ This hospital account has been suspended by administration. Contact: waheeddeveloper@gmail.com');
        } else if (res.error === 'INVALID_PASSWORD') {
          setErrorMessage('Invalid password. Please check your credentials.');
        } else if (res.error === 'NOT_FOUND') {
          setErrorMessage('No registered account found with this email. Please register your account first.');
        } else {
          setErrorMessage('Authentication failed. Please verify credentials.');
        }
        setIsLoading(false);
        return;
      }

      // Successful authentication
      const user = res.user;
      localStorage.setItem('session_user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status
      }));

      // Route to role destination
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'doctor') router.push('/doctor/dashboard');
      else if (user.role === 'medical') router.push('/medical/dashboard');
      else if (user.role === 'lab') router.push('/lab/dashboard');
      else router.push('/patient/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Authentication service error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const staffPresets = DEFAULT_USERS.filter(u => u.role !== 'patient');
  const patientPreset = DEFAULT_USERS.find(u => u.role === 'patient');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Top Hospital Utility Header (Matching momhospital.in) */}
      <header className="w-full bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F4C81] to-[#306CE9] flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5 fill-white/20 stroke-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-[#0F4C81]">DermXAI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">Hospital</span>
              </div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 hidden sm:block">
                Multi-Speciality Hospital & Research Institute
              </span>
            </div>
          </Link>

          <a 
            href="tel:+918912788999" 
            className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
            <span className="text-[10px] uppercase font-bold text-red-600 hidden sm:inline">Emergency 24/7:</span>
            <span className="text-xs font-bold text-gray-900 font-mono">+91 891 278 8999</span>
          </a>
        </div>
      </header>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-8 shadow-xl border border-gray-200/90 relative overflow-hidden">
          
          {/* Decorative Top Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0F4C81] via-[#D4A034] to-[#306CE9]" />

          {/* Hospital Editorial Serif Header */}
          <div className="text-center mb-6 pt-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4A034] block mb-1">
              SECURE CLINICAL ACCESS
            </span>
            <h1 className="font-serif-hospital text-2xl sm:text-3xl text-[#0F4C81] font-normal leading-tight">
              Advanced Care,<br />
              <span className="italic">Compassionate Hearts.</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1.5">
              {activePortal === 'patient' 
                ? 'Sign in to schedule doctor visits and manage disease records' 
                : 'Hospital staff credentialing and medical management'}
            </p>
          </div>

          {/* Portal Switcher Tabs (Patient vs Staff) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-5 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActivePortal('patient');
                setErrorMessage('');
                setHelperNotice('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePortal === 'patient'
                  ? 'bg-white text-[#0F4C81] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Patient Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePortal('staff');
                setErrorMessage('');
                setHelperNotice('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePortal === 'staff'
                  ? 'bg-white text-[#0F4C81] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#D4A034]" />
              <span>Sign In as Staff</span>
            </button>
          </div>

        {/* TAB 1: PATIENT PORTAL LOGIN */}
        {activePortal === 'patient' ? (
          <div>
            <div className="mb-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-900">Patient Appointment Booking</p>
                <p className="text-gray-600 text-[11px] mt-0.5">Sign in to schedule doctor visits and view diagnosis records.</p>
              </div>
              {patientPreset && (
                <button
                  type="button"
                  onClick={() => fillCredentials(patientPreset)}
                  className="px-2.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
                  title="Auto-fill patient demo login"
                >
                  Quick Fill
                </button>
              )}
            </div>
          </div>
        ) : (
          /* TAB 2: STAFF & CLINICAL PORTAL LOGIN */
          <div className="mb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-center">
              Select Staff Department to Auto-Fill
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {staffPresets.map((preset) => {
                const iconMap = {
                  admin: ShieldCheck,
                  doctor: Stethoscope,
                  medical: Pill,
                  lab: Microscope
                };
                const colorMap = {
                  admin: 'text-purple-600',
                  doctor: 'text-blue-600',
                  medical: 'text-indigo-600',
                  lab: 'text-rose-600'
                };
                const Icon = iconMap[preset.role] || ShieldCheck;
                const label = preset.role === 'medical' ? 'Pharmacy' : preset.role === 'lab' ? 'Lab' : preset.role.charAt(0).toUpperCase() + preset.role.slice(1);

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => fillCredentials(preset)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    title={`Fill ${preset.name}`}
                  >
                    <Icon size={14} className={colorMap[preset.role]} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Alerts */}
        {helperNotice && (
          <div className="mb-4 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{helperNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              {activePortal === 'patient' ? 'Patient Email Address' : 'Staff Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                placeholder={activePortal === 'patient' ? 'patient@example.com' : 'physician@hospital.org'}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <span className="text-[11px] text-gray-400 font-mono">
                {email === 'waheeddeveloper@gmail.com' ? 'Waheed@687' : ''}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-blue-500/20 cursor-pointer ${
              activePortal === 'patient' 
                ? 'bg-[#0F4C81] hover:bg-blue-900' 
                : 'bg-[#306CE9] hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : activePortal === 'patient' ? (
              'Sign In to Patient Portal'
            ) : (
              'Sign In to Staff Portal'
            )}
          </button>
        </form>

        {/* Bottom Switcher & Register Links */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center space-y-2 text-xs">
          {activePortal === 'patient' ? (
            <>
              <p className="text-gray-600">
                New patient?{' '}
                <Link href="/register?role=patient" className="font-bold text-[#0F4C81] hover:underline">
                  Register Patient Account
                </Link>
              </p>
              <button
                type="button"
                onClick={() => setActivePortal('staff')}
                className="text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 font-semibold text-[11px]"
              >
                <span>Hospital employee? Switch to Staff Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                New doctor or staff member?{' '}
                <Link href="/register" className="font-bold text-[#306CE9] hover:underline">
                  Submit Staff Registration
                </Link>
              </p>
              <button
                type="button"
                onClick={() => setActivePortal('patient')}
                className="text-gray-500 hover:text-gray-800 inline-flex items-center gap-1 font-semibold text-[11px]"
              >
                <span>Patient booking an appointment? Switch to Patient Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#306CE9] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Loading Hospital Portal...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}