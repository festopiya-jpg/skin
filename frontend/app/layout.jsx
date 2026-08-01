import './globals.css';
import { Inter } from 'next/font/google';
import ChatbotWidget from '@/components/ui/ChatbotWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Skin Care XAI Hospital System',
  description: 'Enterprise-grade Skin Care Diagnostic Hospital Management System using Explainable AI Predictions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-900 text-slate-50 antialiased selection:bg-sky-500/30`}>
        {/* Background decorations for a premium look */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>
        
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}
