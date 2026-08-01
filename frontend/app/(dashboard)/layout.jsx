'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Activity,
  Microscope,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine role based on URL for demo purposes.
  // In a real app, this would come from a global auth state/context.
  let role = 'patient';
  if (pathname.includes('/doctor/')) role = 'doctor';
  if (pathname.includes('/admin/')) role = 'admin';

  const getLinks = () => {
    switch (role) {
      case 'doctor':
        return [
          { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
          { name: 'Patient Queue', href: '/doctor/patients', icon: Users },
          { name: 'XAI Analysis', href: '/doctor/xai-analysis', icon: Microscope },
          { name: 'Schedule', href: '#', icon: Calendar },
        ];
      case 'admin':
        return [
          { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Manage Users', href: '/admin/users', icon: Users },
          { name: 'System Logs', href: '#', icon: FileText },
          { name: 'Settings', href: '#', icon: Settings },
        ];
      default: // patient
        return [
          { name: 'My Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
          { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
          { name: 'Medical Records', href: '/patient/records', icon: FileText },
        ];
    }
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden glass-panel p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <Activity className="text-sky-400 w-6 h-6" />
          <span className="font-bold text-white">DermXAI</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-panel transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col border-r border-slate-700/50
      `}>
        <div className="p-6 hidden md:flex items-center gap-2">
          <Activity className="text-sky-400 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-white">DermXAI</span>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            {role} Portal
          </p>
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-sky-500/10 text-sky-400 font-medium' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : ''}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 md:p-8 relative">
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>
        {children}
      </main>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}