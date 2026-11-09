'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Activity, Mail, Lock, Loader2, UserCheck, ShieldCheck, 
  Stethoscope, Pill, Microscope, AlertCircle, Check 
} from 'lucide-react';
import { verifyUserCredentials, DEFAULT_USERS } from '@/lib/hospitalStore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [helperNotice, setHelperNotice] = useState('');

  // Quick fill helper chips for evaluation
  const fillCredentials = (preset) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setErrorMessage('');
    setHelperNotice(`Loaded credentials for ${preset.name} (${preset.role.toUpperCase()}). Click "Sign In" below.`);
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
          setErrorMessage(`⛔ Staff Account Pending Admin Approval. Your ${res.user.role.toUpperCase()} account has not yet been approved by the Hospital Administrator (waheeddeveloper@gmail.com). Please request approval before logging in.`);
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        
        {/* Hospital Branding Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#306CE9]/10 p-3 rounded-2xl mb-3 border border-blue-500/20">
            <Activity className="text-[#306CE9] w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hospital Clinical Portal</h2>
          <p className="text-gray-500 text-xs mt-1 text-center">
            Sign in with your verified hospital credentials.
          </p>
        </div>

        {/* Demo Helper Chips */}
        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-center">
            Quick-Fill Role Credentials
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {DEFAULT_USERS.map((preset) => {
              const iconMap = {
                admin: ShieldCheck,
                doctor: Stethoscope,
                medical: Pill,
                lab: Microscope,
                patient: UserCheck
              };
              const colorMap = {
                admin: 'text-purple-600',
                doctor: 'text-blue-600',
                medical: 'text-indigo-600',
                lab: 'text-rose-600',
                patient: 'text-emerald-600'
              };
              const Icon = iconMap[preset.role] || UserCheck;
              const label = preset.role === 'medical' ? 'Pharmacy' : preset.role === 'lab' ? 'Lab' : preset.role.charAt(0).toUpperCase() + preset.role.slice(1);

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => fillCredentials(preset)}
                  className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all shadow-sm cursor-pointer"
                  title={`Load ${preset.name} (${preset.role})`}
                >
                  <Icon size={14} className={colorMap[preset.role]} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

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
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                placeholder="user@hospital.org"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <span className="text-xs text-gray-400 font-mono">
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
                className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#306CE9] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#306CE9] disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In to Hospital Portal'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          New patient or hospital staff member?{' '}
          <Link href="/register" className="font-semibold text-[#306CE9] hover:underline">
            Register Hospital Account
          </Link>
        </p>

      </div>
    </div>
  );
}