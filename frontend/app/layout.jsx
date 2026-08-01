import './globals.css';
import { Roboto } from 'next/font/google';
import ChatbotWidget from '@/components/ui/ChatbotWidget';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });

export const metadata = {
  title: 'ElizaCare - Hospital Booking',
  description: 'Seamless Hospital Booking for Your Health Needs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} min-h-screen bg-[#F8F9FA] text-[#101010] antialiased selection:bg-blue-600/30`}>
        {/* Soft light theme decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[100px]" />
        </div>
        
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}
