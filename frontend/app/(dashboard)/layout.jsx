'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  LogOut,
  Activity,
  Microscope,
  Menu,
  X,
  Loader2,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Pill
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);

  // Authentication & Role-Based Route Guard
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem('session_user');
      if (!rawSession) {
        router.replace('/login');
        return;
      }

      const user = JSON.parse(rawSession);
      if (!user || !user.email) {
        localStorage.removeItem('session_user');
        router.replace('/login');
        return;
      }

      // Check role permissions:
      const userRole = user.role || 'patient';

      // Admin has full access to all areas
      if (userRole === 'admin') {
        setSessionUser(user);
        setIsAuthorized(true);
        return;
      }

      // Guard /admin routes
      if (pathname.startsWith('/admin') && userRole !== 'admin') {
        router.replace(userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
        return;
      }

      // Guard /doctor routes
      if (pathname.startsWith('/doctor') && userRole !== 'doctor') {
        router.replace('/patient/dashboard');
        return;
      }

      // Guard /medical (pharmacy) routes
      if (pathname.startsWith('/medical') && userRole !== 'medical') {
        router.replace('/patient/dashboard');
        return;
      }

      // Guard /lab routes
      if (pathname.startsWith('/lab') && userRole !== 'lab') {
        router.replace('/patient/dashboard');
        return;
      }

      setSessionUser(user);
      setIsAuthorized(true);
    } catch (err) {
      console.error('Session verification error:', err);
      router.replace('/login');
    }
  }, [pathname, router]);

  const handleSignOut = () => {
    localStorage.removeItem('session_user');
    router.replace('/login');
  };

  // Determine active portal role
  let role = sessionUser?.role || 'patient';
  if (pathname.includes('/doctor/')) role = 'doctor';
  if (pathname.includes('/admin/')) role = 'admin';
  if (pathname.includes('/medical/')) role = 'medical';
  if (pathname.includes('/lab/')) role = 'lab';

  const getLinks = () => {
    switch (role) {
      case 'doctor':
        return [
          { name: 'Clinical Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
          { name: 'Patient Queue', href: '/doctor/patients', icon: Users },
          { name: 'XAI Lesion Analysis', href: '/doctor/xai-analysis', icon: Microscope },
          { name: '3D Health Radar', href: '/test-3d', icon: Activity },
        ];
      case 'admin':
        return [
          { name: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Manage Staff & Users', href: '/admin/users', icon: Users },
          { name: 'Clinical Pharmacy Desk', href: '/medical/dashboard', icon: FileText },
          { name: 'Pathology Lab Desk', href: '/lab/dashboard', icon: Microscope },
        ];
      case 'medical':
        return [
          { name: 'Pharmacy Queue', href: '/medical/dashboard', icon: LayoutDashboard },
          { name: 'Patient Records', href: '/patient/records', icon: FileText },
        ];
      case 'lab':
        return [
          { name: 'Pathology Lab Orders', href: '/lab/dashboard', icon: Microscope },
          { name: 'Biopsy Registry', href: '/patient/records', icon: FileText },
        ];
      default: // patient
        return [
          { name: 'My Diagnostic Portal', href: '/patient/dashboard', icon: LayoutDashboard },
          { name: '3D Health Radar', href: '/test-3d', icon: Activity },
          { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
          { name: 'Medical Records', href: '/patient/records', icon: FileText },
        ];
    }
  };

  // Show clinical authorization loader while checking credentials
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#306CE9] animate-spin" />
        <p className="text-sm font-semibold text-gray-600">Verifying hospital credentials...</p>
      </div>
    );
  }

  const links = getLinks();

  const getRoleBadge = () => {
    switch (sessionUser?.role) {
      case 'admin':
        return { label: 'Administrator', icon: ShieldCheck, color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'doctor':
        return { label: 'Attending Physician', icon: Stethoscope, color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'medical':
        return { label: 'Hospital Pharmacist', icon: Pill, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'lab':
        return { label: 'Pathology Specialist', icon: Microscope, color: 'bg-rose-100 text-rose-800 border-rose-200' };
      default:
        return { label: 'Patient Portal', icon: UserCheck, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <Activity className="text-[#306CE9] w-6 h-6" />
          <span className="font-bold text-gray-900">DermXAI</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-900 p-1">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Brand */}
        <div className="p-6 hidden md:flex items-center gap-2.5 border-b border-gray-200/80 bg-white">
          <div className="bg-[#306CE9]/10 p-2 rounded-xl border border-blue-500/20">
            <Activity className="text-[#306CE9] w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-gray-900 block leading-tight">DermXAI</span>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hospital System</span>
          </div>
        </div>
        
        {/* User Card */}
        <div className="p-4 border-b border-gray-200 bg-white/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0 border border-blue-200">
              {(sessionUser?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 truncate">{sessionUser?.name || 'User'}</p>
              <p className="text-[11px] text-gray-500 truncate font-mono">{sessionUser?.email}</p>
            </div>
          </div>
          <div className="mt-2.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.color}`}>
              <BadgeIcon className="w-3 h-3" />
              {badge.label}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-4 flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-3">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#306CE9] text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-200 bg-white/40">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border border-rose-100 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-4 md:p-8">
        {children}
      </main>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}