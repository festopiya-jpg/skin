'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your DermXAI Assistant. How can I help you with your dermatology or platform questions today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      setMessages([...newMsgs, { 
        role: 'ai', 
        content: 'I understand you need assistance. Currently, I am a placeholder AI. In production, I will query your Electronic Health Records and our NLP models to provide specialized advice!' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center transition-transform hover:scale-110 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 md:w-96 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl flex flex-col z-50 transform transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-800 p-4 border-b border-slate-700 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-sky-500/20 p-1.5 rounded-lg">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">DermXAI Assistant</h3>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user' 
                  ? 'bg-sky-500 text-white rounded-br-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-sky-500"
            />
            <button 
              type="submit" 
              className="absolute right-2 p-1.5 bg-sky-500 hover:bg-sky-400 rounded-full text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
