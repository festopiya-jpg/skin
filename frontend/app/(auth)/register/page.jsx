'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Mail, Lock, User, UserCircle, Loader2 } from 'lucide-react';
import { supabase, mockRegister } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (supabase) {
        // Real Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: role,
            }
          }
        });
        if (error) {
          console.warn("Supabase auth failed (likely rate limit). Falling back to mock auth...", error);
          const { user } = await mockRegister(email, password, name, role);
          
          if (user.role === 'doctor') {
            const doctors = JSON.parse(localStorage.getItem('system_doctors') || '[]');
            if (!doctors.find(d => d.email === email)) {
              localStorage.setItem('system_doctors', JSON.stringify([...doctors, { id: Date.now(), name, email }]));
            }
            router.push('/doctor/dashboard');
          }
          else if (user.role === 'medical') router.push('/medical/dashboard');
          else if (user.role === 'lab') router.push('/lab/dashboard');
          else router.push('/patient/dashboard');
          return;
        }
        
        // On success, redirect based on role
        if (role === 'doctor') {
          const doctors = JSON.parse(localStorage.getItem('system_doctors') || '[]');
          if (!doctors.find(d => d.email === email)) {
            localStorage.setItem('system_doctors', JSON.stringify([...doctors, { id: Date.now(), name, email }]));
          }
          router.push('/doctor/dashboard');
        }
        else if (role === 'medical') router.push('/medical/dashboard');
        else if (role === 'lab') router.push('/lab/dashboard');
        else router.push('/patient/dashboard');
      } else {
        // Mock fallback
        const { user } = await mockRegister(email, password, name, role);
        if (user.role === 'doctor') router.push('/doctor/dashboard');
        else if (user.role === 'medical') router.push('/medical/dashboard');
        else if (user.role === 'lab') router.push('/lab/dashboard');
        else router.push('/patient/dashboard');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[#F8F9FA]">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10 border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-xl mb-4">
            <UserCircle className="text-emerald-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Join DermXAI and get instant AI-powered skin analysis.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 text-gray-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${role === 'patient' ? 'bg-emerald-100 border-emerald-500 text-emerald-300' : 'bg-white/50 border-gray-200 text-gray-500 hover:bg-white'}`}>
                <input type="radio" name="role" value="patient" className="hidden" checked={role === 'patient'} onChange={() => setRole('patient')} />
                Patient
              </label>
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${role === 'doctor' ? 'bg-[#306CE9]/20 border-blue-500 text-blue-700' : 'bg-white/50 border-gray-200 text-gray-500 hover:bg-white'}`}>
                <input type="radio" name="role" value="doctor" className="hidden" checked={role === 'doctor'} onChange={() => setRole('doctor')} />
                Doctor
              </label>
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${role === 'medical' ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-white/50 border-gray-200 text-gray-500 hover:bg-white'}`}>
                <input type="radio" name="role" value="medical" className="hidden" checked={role === 'medical'} onChange={() => setRole('medical')} />
                Pharmacist
              </label>
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${role === 'lab' ? 'bg-rose-100 border-rose-500 text-rose-300' : 'bg-white/50 border-gray-200 text-gray-500 hover:bg-white'}`}>
                <input type="radio" name="role" value="lab" className="hidden" checked={role === 'lab'} onChange={() => setRole('lab')} />
                Lab Tech
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-gray-900 bg-emerald-500 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
