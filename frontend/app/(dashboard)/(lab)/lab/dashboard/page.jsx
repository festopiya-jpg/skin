'use client';

import { useState, useEffect } from 'react';
import { Microscope, CheckCircle, Clock } from 'lucide-react';

export default function LabDashboard() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Load approved lab orders from Doctor via localStorage
    const saved = localStorage.getItem('pending_lab');
    if (saved) {
      setQueue(JSON.parse(saved));
    }
  }, []);

  const handleCompleteTest = (id) => {
    const updatedQueue = queue.filter(q => q.id !== id);
    setQueue(updatedQueue);
    localStorage.setItem('pending_lab', JSON.stringify(updatedQueue));
    alert('Lab tests marked as Completed!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Microscope className="text-rose-400 w-8 h-8" />
          Lab Technician Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Manage doctor-approved lab test orders.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Pending Lab Tests</h2>
        </div>
        <div className="overflow-x-auto p-4">
          {queue.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400 font-medium">No pending lab orders.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((order) => (
                <div key={order.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-bold">{order.name}</span>
                      <span className="text-slate-500 text-sm">• {order.time}</span>
                    </div>
                    <p className="text-rose-300 text-sm font-medium mb-1">Condition Suspected: {order.condition}</p>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 mt-2">
                      <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                        {order.research || "No specific instructions provided."}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCompleteTest(order.id)}
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark Completed
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
