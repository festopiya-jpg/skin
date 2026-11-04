import './globals.css';
import ChatbotWidget from '@/components/ui/ChatbotWidget';

export const metadata = {
  title: 'DermXAI - 3D Clinical Diagnostics & Hospital Platform',
  description: 'AI-Powered Dermatology & 3D Interactive Clinical Diagnostic System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F9FA] text-[#101010] antialiased font-sans selection:bg-blue-600/30">
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
