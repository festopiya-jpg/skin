'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Activity, Mail, Lock, User, UserCircle, Loader2, 
  Stethoscope, Pill, Microscope, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { registerHospitalUser } from '@/lib/hospitalStore';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [department, setDepartment] = useState('');
  const [license, setLicense] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessInfo(null);

    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanName || !cleanEmail || !cleanPass) {
        setErrorMsg('Please complete all required fields.');
        setIsLoading(false);
        return;
      }

      if (cleanPass.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        setIsLoading(false);
        return;
      }

      const res = registerHospitalUser({
        name: cleanName,
        email: cleanEmail,
        password: cleanPass,
        role,
        department: department || (role === 'doctor' ? 'Clinical Dermatology' : role === 'medical' ? 'Clinical Pharmacy' : role === 'lab' ? 'Dermatopathology Lab' : 'Outpatient Clinic'),
        license: license || `LIC-${Math.floor(100000 + Math.random() * 900000)}`
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      if (role === 'patient') {
        // Patient accounts are immediately active! No admin approval needed.
        localStorage.setItem('session_user', JSON.stringify({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: 'patient',
          department: res.user.department,
          status: 'APPROVED'
        }));

        setSuccessInfo({
          type: 'PATIENT_ACTIVE',
          title: 'Patient Account Activated!',
          message: `Welcome, ${cleanName}! Your patient account is active immediately with zero waiting. You can now proceed to book an appointment with our specialist physicians and scan to pay the consultation fee via UPI QR Pay.`
        });
      } else {
        setSuccessInfo({
          type: 'PENDING_APPROVAL',
          title: 'Staff Registration Submitted for Admin Approval!',
          message: `Your ${role.toUpperCase()} account (${cleanName}) has been registered. Clinical employee accounts are protected by hospital security protocols and are PENDING approval by Hospital Administrator (waheeddeveloper@gmail.com). You will be able to sign in once approved in the Admin Tower.`
        });
      }

    } catch (error) {
      console.error('Registration error:', error);
      setErrorMsg('An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 relative z-10 border border-gray-200 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#306CE9]/10 p-3 rounded-2xl mb-3 border border-blue-500/20">
            <Activity className="text-[#306CE9] w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Hospital Account</h2>
          <p className="text-gray-500 text-xs mt-1 text-center">
            Register as a Patient (Instant Access), or Physician, Pharmacist & Lab Tech.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Modal / Banner */}
        {successInfo ? (
          <div className="py-6 text-center space-y-4">
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${
              successInfo.type === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {successInfo.type === 'PENDING_APPROVAL' ? (
                <ShieldAlert className="w-8 h-8" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900">{successInfo.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
              {successInfo.message}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              {successInfo.type === 'PATIENT_ACTIVE' ? (
                <>
                  <Link
                    href="/patient/appointments"
                    className="bg-[#0F4C81] hover:bg-blue-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    Book Appointment & Pay (QR) →
                  </Link>
                  <Link
                    href="/patient/dashboard"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    Go to Patient Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  href="/login?portal=staff"
                  className="bg-[#306CE9] hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Go to Staff Login
                </Link>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Role Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Account Type / Role</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'patient', label: 'Patient', icon: UserCircle, color: 'text-emerald-600' },
                  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'text-blue-600' },
                  { id: 'medical', label: 'Pharmacy', icon: Pill, color: 'text-indigo-600' },
                  { id: 'lab', label: 'Lab Tech', icon: Microscope, color: 'text-rose-600' },
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50/80 border-[#306CE9] text-[#306CE9] shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${r.color}`} />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
              {role !== 'patient' && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1.5">
                  ⚠️ Note: {role === 'doctor' ? 'Doctor' : role === 'medical' ? 'Pharmacist' : 'Lab'} accounts require verification and approval by the Hospital Administrator before login.
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                  placeholder={role === 'doctor' ? 'Dr. John Doe, MD' : role === 'medical' ? 'Elena Rostova, PharmD' : 'Full Name'}
                />
              </div>
            </div>

            {/* Email */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                  placeholder="name@hospital.org"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Staff Department & License fields if not patient */}
            {role !== 'patient' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-700">Department / Specialty</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                    placeholder={role === 'doctor' ? 'Dermatology' : role === 'medical' ? 'Clinical Pharmacy' : 'Histopathology'}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-700">Medical License / NPI</label>
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
                    placeholder="NPI-1849204921"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#306CE9] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#306CE9] disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 cursor-pointer mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Register Account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#306CE9] hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
