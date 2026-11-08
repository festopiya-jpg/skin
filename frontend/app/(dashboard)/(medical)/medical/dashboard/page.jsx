'use client';

import { useState, useEffect } from 'react';
import { Pill, CheckCircle, Clock, PackageCheck, AlertCircle, FileText, User } from 'lucide-react';
import { initHospitalStore } from '@/lib/hospitalStore';

export default function MedicalDashboard() {
  const [queue, setQueue] = useState([]);
  const [dispensedCount, setDispensedCount] = useState(0);

  const loadPrescriptions = () => {
    initHospitalStore();
    const saved = localStorage.getItem('pending_medical');
    if (saved) {
      try {
        setQueue(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleDispense = (id) => {
    const updatedQueue = queue.map(q => {
      if (q.id === id) {
        return { ...q, status: 'Dispensed', dispensedAt: new Date().toLocaleTimeString() };
      }
      return q;
    });
    setQueue(updatedQueue);
    localStorage.setItem('pending_medical', JSON.stringify(updatedQueue));
    setDispensedCount(prev => prev + 1);
  };

  const pendingOrders = queue.filter(q => q.status !== 'Dispensed');
  const completedOrders = queue.filter(q => q.status === 'Dispensed');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <Pill className="w-8 h-8" />
            </div>
            Clinical Pharmacy & Dispensary
          </h1>
          <p className="text-gray-500 mt-1">Hospital Dispensary Queue for dermatologist-issued prescriptions and topical therapeutics.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-center shadow-sm">
            <span className="text-xs text-gray-400 block font-semibold uppercase">Pending Dispense</span>
            <span className="text-xl font-bold text-amber-600">{pendingOrders.length}</span>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-center shadow-sm">
            <span className="text-xs text-gray-400 block font-semibold uppercase">Fulfilled</span>
            <span className="text-xl font-bold text-emerald-600">{completedOrders.length}</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Active Prescription Queue</h2>
            <p className="text-xs text-gray-500">Electronically transmitted from Dermatology Clinical Exam Desk</p>
          </div>
        </div>
        
        <div className="p-6">
          {queue.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-600 font-semibold text-lg">No pending prescriptions in hospital queue</p>
              <p className="text-xs text-gray-400 mt-1">When a doctor prescribes medications from the Doctor Desk, they will stream here live.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {queue.map((order) => {
                const patientName = order.patientName || order.name || 'Patient';
                const isDispensed = order.status === 'Dispensed';

                return (
                  <div 
                    key={order.id} 
                    className={`border rounded-2xl p-6 transition-all ${
                      isDispensed 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg font-bold text-gray-900">{patientName}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {order.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isDispensed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {isDispensed ? 'Dispensed' : 'Action Required'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Prescribing Physician: <span className="font-semibold text-gray-700">{order.doctorName || 'Dr. Sarah Mercer, MD'}</span> • Date: {order.date || 'Today'}
                        </p>
                      </div>

                      <div>
                        {!isDispensed ? (
                          <button 
                            onClick={() => handleDispense(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                          >
                            <PackageCheck className="w-5 h-5" />
                            Dispense Medications
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg">
                            <CheckCircle className="w-4 h-4" /> Fulfilled & Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Prescribed Therapeutics</span>
                        {Array.isArray(order.medications) && order.medications.length > 0 ? (
                          <div className="space-y-2">
                            {order.medications.map((med, i) => (
                              <div key={i} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-gray-800 text-sm">{med.name}</p>
                                  <p className="text-xs text-gray-500">{med.dosage}</p>
                                </div>
                                <span className="text-xs font-semibold bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-700">
                                  {med.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono">
                            {order.research || "Topical dermatological formulation as specified."}
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Clinical Indication & Notes</span>
                        <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl text-xs space-y-1.5">
                          <p className="text-blue-900 font-bold">Indication: {order.condition || 'Cutaneous Neoplasm / Dermatitis'}</p>
                          <p className="text-gray-600">{order.pharmacyNotes || 'Review patient allergy profile before dispensing. Counsel on sun protection.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
