'use client';

import { useState, useEffect } from 'react';
import { Pill, CheckCircle, Clock } from 'lucide-react';

export default function MedicalDashboard() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Load approved medical orders from Doctor via localStorage
    const saved = localStorage.getItem('pending_medical');
    if (saved) {
      setQueue(JSON.parse(saved));
    }
  }, []);

  const handleDispense = (id) => {
    const updatedQueue = queue.filter(q => q.id !== id);
    setQueue(updatedQueue);
    localStorage.setItem('pending_medical', JSON.stringify(updatedQueue));
    alert('Medication marked as Dispensed!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Pill className="text-[#306CE9] w-8 h-8" />
          Pharmacy / Medical Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Manage doctor-approved medication orders.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Pending Prescriptions</h2>
        </div>
        <div className="overflow-x-auto p-4">
          {queue.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-500 font-medium">No pending medication orders.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((order) => (
                <div key={order.id} className="bg-white/50 border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-900 font-bold">{order.name}</span>
                      <span className="text-gray-400 text-sm">• {order.time}</span>
                    </div>
                    <p className="text-blue-700 text-sm font-medium mb-1">Diagnosis: {order.condition}</p>
                    <div className="bg-white/50 p-3 rounded-lg border border-gray-200 mt-2">
                      <p className="text-sm text-gray-600 font-mono whitespace-pre-wrap">
                        {order.research || "No specific instructions provided."}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDispense(order.id)}
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-medium px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark Dispensed
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
