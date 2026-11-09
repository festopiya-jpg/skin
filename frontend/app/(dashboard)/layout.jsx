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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Hospital Top Utility Bar (Matching Landing Page) */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Hospital Brand Crest */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle Navigation"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F4C81] to-[#306CE9] flex items-center justify-center text-white shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
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
            </div>

            {/* Right Header: Emergency Hotline & User Pill */}
            <div className="flex items-center gap-3 sm:gap-5">
              <a 
                href="tel:+918912788999" 
                className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
                title="24/7 Casualty & Trauma Unit"
              >
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                <span className="text-[10px] uppercase font-bold text-red-600">24/7 Hotline:</span>
                <span className="text-xs font-bold text-gray-900 font-mono">+91 891 278 8999</span>
              </a>

              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {(sessionUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-tight">{sessionUser?.name || 'User'}</p>
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider text-blue-700`}>
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Clinical Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#07213A] text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-white md:text-gray-900 md:border md:border-gray-200 md:rounded-3xl md:shadow-xs
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col shrink-0 overflow-hidden
        `}>
          {/* User Profile Card */}
          <div className="p-5 border-b border-gray-100 md:bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F4C81] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                {(sessionUser?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 md:text-gray-900 text-white truncate">{sessionUser?.name || 'User'}</p>
                <p className="text-[11px] text-gray-400 md:text-gray-500 truncate font-mono">{sessionUser?.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${badge.color}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-1">
              Clinical Department
            </p>
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#0F4C81] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4A034]' : 'text-gray-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* OPD Schedule Card & Sign Out */}
          <div className="p-3.5 border-t border-gray-100 bg-slate-50/40 space-y-2">
            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/60 text-[10px] text-blue-900">
              <strong className="block text-[11px] font-bold">OPD Consultation Hours</strong>
              <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-transparent">
          {children}
        </main>

      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-2xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}