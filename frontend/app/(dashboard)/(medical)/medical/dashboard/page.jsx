'use client';

import { useState, useEffect } from 'react';
import { 
  Pill, CheckCircle, Clock, PackageCheck, AlertCircle, 
  FileText, User, Printer, Search, ShieldCheck, X, Check 
} from 'lucide-react';
import { initHospitalStore } from '@/lib/hospitalStore';

export default function MedicalDashboard() {
  const [queue, setQueue] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);
  const [pharmacistNotes, setPharmacistNotes] = useState({});
  const [pharmacistProfile, setPharmacistProfile] = useState({ name: 'Elena Rostova, PharmD', license: 'RPH-8849201' });

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
    if (typeof window !== 'undefined') {
      const session = JSON.parse(localStorage.getItem('session_user') || '{}');
      if (session.name) {
        setPharmacistProfile({
          name: session.name,
          license: session.license || 'RPH-8849201'
        });
      }
    }
  }, []);

  const handleDispense = (id) => {
    const updatedQueue = queue.map(q => {
      if (q.id === id) {
        return { 
          ...q, 
          status: 'Dispensed', 
          dispensedAt: new Date().toLocaleTimeString(),
          pharmacist: pharmacistProfile.name,
          verificationNote: pharmacistNotes[id] || 'Topical safety profile verified. Patient advised on sun protection.'
        };
      }
      return q;
    });
    setQueue(updatedQueue);
    localStorage.setItem('pending_medical', JSON.stringify(updatedQueue));
  };

  const filteredQueue = queue.filter(q => {
    const pName = q.patientName || q.name || '';
    const cond = q.condition || '';
    return pName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           cond.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const pendingOrders = queue.filter(q => q.status !== 'Dispensed');
  const completedOrders = queue.filter(q => q.status === 'Dispensed');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header & Pharmacist Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-600">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hospital Pharmacy & Dispensary Desk</h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Logged in: <strong className="text-gray-800">{pharmacistProfile.name}</strong> • License: {pharmacistProfile.license} • Central Hospital Formulary
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search prescription or patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
            />
          </div>
          <div className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Pending</span>
            <span className="text-lg font-black text-amber-600">{pendingOrders.length}</span>
          </div>
          <div className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Fulfilled</span>
            <span className="text-lg font-black text-emerald-600">{completedOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Main Prescription Queue */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Live Physician e-Prescription Queue</h2>
            <p className="text-xs text-gray-500">Electronically transmitted from Dermatology Clinical Exam Desk</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full">
            {filteredQueue.length} Active Rx
          </span>
        </div>
        
        <div className="p-6">
          {filteredQueue.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-bold text-base">No pending prescriptions in queue</p>
              <p className="text-xs text-gray-400 mt-1">When attending doctors issue prescriptions in the Doctor Desk, they stream here instantly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQueue.map((order) => {
                const patientName = order.patientName || order.name || 'Patient';
                const isDispensed = order.status === 'Dispensed';

                return (
                  <div 
                    key={order.id} 
                    className={`border rounded-2xl p-5 transition-all ${
                      isDispensed 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : 'bg-white border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-gray-900">{patientName}</span>
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {order.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isDispensed 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {isDispensed ? 'Dispensed & Verified' : 'Awaiting Fulfillment'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Prescribing Physician: <span className="font-semibold text-gray-700">{order.doctorName || 'Dr. Sarah Mercer, MD'}</span> • Date: {order.date || 'Today'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrderForPrint(order)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Dispense Slip</span>
                        </button>

                        {!isDispensed ? (
                          <button 
                            onClick={() => handleDispense(order.id)}
                            className="bg-[#306CE9] hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                          >
                            <PackageCheck className="w-4 h-4" />
                            <span>Verify & Dispense</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> Ready for Patient Pickup
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Prescribed Therapeutics</span>
                        {Array.isArray(order.medications) && order.medications.length > 0 ? (
                          <div className="space-y-2">
                            {order.medications.map((med, i) => (
                              <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center text-xs">
                                <div>
                                  <p className="font-bold text-gray-900">{med.name}</p>
                                  <p className="text-gray-500 mt-0.5">{med.dosage}</p>
                                </div>
                                <span className="font-semibold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-700">
                                  {med.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono">
                            {order.research || "Topical dermatological therapeutic formulation as directed."}
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Pharmacist Counseling & Clinical Note</span>
                        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-xs space-y-1.5">
                          <p className="text-blue-900 font-bold">Indication: {order.condition || 'Atypical Lesion / Topical Treatment'}</p>
                          <p className="text-gray-600 leading-relaxed">{order.pharmacyNotes || 'Review patient allergy profile before dispensing. Counsel on sun protection.'}</p>
                          {isDispensed && (
                            <p className="text-emerald-700 font-semibold pt-1 border-t border-blue-100">
                              ✓ Verified by {order.pharmacist || 'Elena Rostova, PharmD'} at {order.dispensedAt || '10:45 AM'}
                            </p>
                          )}
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

      {/* Printable Dispense Slip Modal */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Official Pharmacy Dispensation Slip</h3>
                <p className="text-xs text-gray-500">Hospital Formulary & Prescription Label</p>
              </div>
              <button 
                onClick={() => setSelectedOrderForPrint(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-gray-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <div>
                  <p className="text-gray-400 font-medium">Patient</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrderForPrint.patientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-medium">Rx Identifier</p>
                  <p className="font-mono font-bold text-blue-700">{selectedOrderForPrint.id}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-1.5">Dispensed Therapeutics:</p>
                {Array.isArray(selectedOrderForPrint.medications) ? (
                  selectedOrderForPrint.medications.map((m, i) => (
                    <div key={i} className="p-2 border border-gray-200 rounded-lg mb-1 flex justify-between">
                      <span className="font-semibold text-gray-900">{m.name} ({m.dosage})</span>
                      <span className="text-gray-500 font-mono">{m.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">{selectedOrderForPrint.condition}</p>
                )}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between text-gray-500 text-[11px]">
                <span>Pharmacist: {selectedOrderForPrint.pharmacist || pharmacistProfile.name}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => setSelectedOrderForPrint(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => { window.print(); setSelectedOrderForPrint(null); }}
                className="px-4 py-2 bg-[#306CE9] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Label
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
