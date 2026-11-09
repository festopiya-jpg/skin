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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-7 shadow-xl border border-gray-200">
        
        {/* Hospital Branding Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F4C81] to-[#306CE9] flex items-center justify-center text-white mb-2 shadow-sm">
            <Shield className="w-7 h-7 fill-white/20 stroke-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-[#0F4C81]">DermXAI</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Hospital</span>
          </div>
          <p className="text-gray-500 text-xs mt-0.5 text-center">
            {activePortal === 'patient' 
              ? 'Patient Appointment & AI Diagnostic Portal' 
              : 'Secure Employee & Clinical Staff Portal'}
          </p>
        </div>

        {/* Portal Switcher Tabs (Patient vs Staff) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActivePortal('patient');
              setErrorMessage('');
              setHelperNotice('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePortal === 'staff'
                ? 'bg-white text-[#0F4C81] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
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