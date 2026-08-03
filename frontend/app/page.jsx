import Link from 'next/link';
import { Activity, CalendarClock, Building2, ClipboardEdit } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-md py-4 px-8 flex justify-between items-center fixed top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Activity className="text-[#306CE9] w-6 h-6" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">DermXAI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#" className="text-[#306CE9]">Home</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">About Us</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Services</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Doctors</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link 
            href="/register" 
            className="text-sm bg-[#306CE9] hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md shadow-blue-500/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
        
        {/* Hero Text */}
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Seamless Hospital Booking for Your Health Needs
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Book appointments easily with top hospitals and trusted doctors. 
            Get fast access to medical services and expert care.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-5xl h-[300px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="/hero.jpg" 
            alt="Doctor interacting with patient" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay Gradient for readability at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Floating Feature Cards */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 px-4 z-10 w-full max-w-5xl -mt-16 md:-mt-24 mb-20">
          
          {/* Blue Card */}
          <div className="bg-[#306CE9] text-white p-5 rounded-2xl w-full md:w-64 shadow-xl transform hover:-translate-y-2 transition-transform">
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <CalendarClock className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1">Doctor Schedule</h3>
            <p className="text-blue-100 text-sm">Find and schedule appointments with top doctors at your preferred hospital.</p>
          </div>

          {/* White Card 1 */}
          <div className="bg-white text-gray-900 p-5 rounded-2xl w-full md:w-64 shadow-xl hover:-translate-y-2 transition-transform">
            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5 text-[#306CE9]" />
            </div>
            <h3 className="font-bold text-lg mb-1">Room Info</h3>
            <p className="text-gray-500 text-sm">Immediate access to emergency care. Find the nearest hospital and get urgent help.</p>
          </div>

          {/* White Card 2 */}
          <div className="bg-white text-gray-900 p-5 rounded-2xl w-full md:w-64 shadow-xl hover:-translate-y-2 transition-transform">
            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <ClipboardEdit className="w-5 h-5 text-[#306CE9]" />
            </div>
            <h3 className="font-bold text-lg mb-1">Online Registration</h3>
            <p className="text-gray-500 text-sm">Register easily online to book your check-ups and avoid waiting in lines.</p>
          </div>

        </div>

      </main>
    </div>
  );
}
