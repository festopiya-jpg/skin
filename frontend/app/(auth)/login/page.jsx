'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase, mockLogin } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (supabase) {
        // Real Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Optionally, fetch user role from a profiles table if you have one.
        // For demo, we just route based on email like the mock does.
        let role = data.user.user_metadata?.role || 'patient';
        if (email.includes('doctor')) role = 'doctor';
        if (email.includes('admin')) role = 'admin';
        if (email.includes('medical') || email.includes('pharmacy')) role = 'medical';
        if (email.includes('lab')) role = 'lab';

        if (role === 'doctor') router.push('/doctor/dashboard');
        else if (role === 'medical') router.push('/medical/dashboard');
        else if (role === 'lab') router.push('/lab/dashboard');
        else if (role === 'admin') router.push('/admin/dashboard');
        else router.push('/patient/dashboard');
      } else {
        // Mock fallback
        const { user } = await mockLogin(email, password);
        let role = user.role;
        if (email.includes('medical') || email.includes('pharmacy')) role = 'medical';
        if (email.includes('lab')) role = 'lab';

        if (role === 'doctor') router.push('/doctor/dashboard');
        else if (role === 'medical') router.push('/medical/dashboard');
        else if (role === 'lab') router.push('/lab/dashboard');
        else if (role === 'admin') router.push('/admin/dashboard');
        else router.push('/patient/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-sky-500/20 p-3 rounded-xl mb-4">
            <Activity className="text-sky-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1 text-center">
            Enter your credentials to access the DermXAI Hospital System. <br/>
            (Tip: Use 'doctor@...' to login as Doctor)
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Link href="#" className="text-sm font-medium text-sky-400 hover:text-sky-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-sky-500 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-sky-400 hover:text-sky-300 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}