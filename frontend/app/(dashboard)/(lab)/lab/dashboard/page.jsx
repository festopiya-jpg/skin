'use client';

import { useState, useEffect } from 'react';
import { 
  Microscope, CheckCircle, Clock, TestTube2, AlertTriangle, 
  MapPin, FileSearch, Search, Printer, X, Check, ShieldCheck 
} from 'lucide-react';
import { initHospitalStore } from '@/lib/hospitalStore';

export default function LabDashboard() {
  const [queue, setQueue] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabForPrint, setSelectedLabForPrint] = useState(null);
  const [stainTypes, setStainTypes] = useState({});
  const [marginStatuses, setMarginStatuses] = useState({});

  const loadLabQueue = () => {
    initHospitalStore();
    const saved = localStorage.getItem('pending_lab');
    if (saved) {
      try {
        setQueue(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadLabQueue();
  }, []);

  const handleCompleteTest = (id) => {
    const chosenStain = stainTypes[id] || 'Fontana-Masson & H&E Stain';
    const chosenMargin = marginStatuses[id] || 'Clear Surgical Margins (>5mm) Confirmed';

    const updatedQueue = queue.map(q => {
      if (q.id === id) {
        return { 
          ...q, 
          status: 'Histopathology Finalized', 
          completedAt: new Date().toLocaleTimeString(),
          stain: chosenStain,
          marginStatus: chosenMargin,
          pathologist: 'Dr. Victor Chen, PhD (Dermatopathology)',
          findings: `Microscopic verification complete via ${chosenStain}. Histological assessment: ${chosenMargin}. No angiolymphatic invasion observed.`
        };
      }
      return q;
    });
    setQueue(updatedQueue);
    localStorage.setItem('pending_lab', JSON.stringify(updatedQueue));
  };

  const filteredQueue = queue.filter(q => {
    const pName = q.patientName || q.name || '';
    const site = q.anatomicalSite || '';
    return pName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           site.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const pendingTests = queue.filter(q => q.status !== 'Histopathology Finalized');
  const completedTests = queue.filter(q => q.status === 'Histopathology Finalized');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header & Lab Specialist Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600">
              <Microscope className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dermatopathology & Biopsy Lab Desk</h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Logged in: <strong className="text-gray-800">Dr. Victor Chen, PhD</strong> • Credentials: DABCC-91204 • Histology & Immunofluorescence Lab
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search patient or specimen site..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
            />
          </div>
          <div className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Pending</span>
            <span className="text-lg font-black text-rose-600">{pendingTests.length}</span>
          </div>
          <div className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Completed</span>
            <span className="text-lg font-black text-emerald-600">{completedTests.length}</span>
          </div>
        </div>
      </div>

      {/* Main Specimen Registry */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Biopsy Specimen & Histology Registry</h2>
            <p className="text-xs text-gray-500">Ordered by attending physicians following 3D dermoscopic lesion evaluation</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full">
            {filteredQueue.length} Specimen{filteredQueue.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="p-6">
          {filteredQueue.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-bold text-base">No pending biopsy specimens</p>
              <p className="text-xs text-gray-400 mt-1">When attending doctors order histopathology from the Doctor Desk, punch biopsies stream here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQueue.map((order) => {
                const patientName = order.patientName || order.name || 'Patient';
                const isFinalized = order.status === 'Histopathology Finalized';

                return (
                  <div 
                    key={order.id} 
                    className={`border rounded-2xl p-5 transition-all ${
                      isFinalized 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : 'bg-white border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-gray-900">{patientName}</span>
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            {order.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isFinalized 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-rose-100 text-rose-800 border-rose-200'
                          }`}>
                            {isFinalized ? 'Histology Released' : 'Specimen Queued'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Ordering Doctor: <span className="font-semibold text-gray-700">{order.doctorName || 'Dr. Sarah Mercer, MD'}</span> • Date: {order.date || 'Today'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLabForPrint(order)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Pathology Report</span>
                        </button>

                        {!isFinalized ? (
                          <button 
                            onClick={() => handleCompleteTest(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                          >
                            <TestTube2 className="w-4 h-4" />
                            <span>Finalize Histology</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> Findings Released to Physician
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Test Type & Priority</span>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                          <p className="font-bold text-gray-900">{order.testType || 'Punch Biopsy & Histopathology'}</p>
                          <p className="text-rose-600 font-semibold mt-1">Priority: {order.priority || 'STAT (Urgent)'}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Anatomical Lesion Site</span>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2 text-xs">
                          <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div>
                            <p className="font-bold text-gray-900">{order.anatomicalSite || 'Cutaneous Scalp'}</p>
                            <p className="text-gray-400 text-[11px]">Mapped on 3D Body Mesh</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Histopathology Findings</span>
                        <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-xl text-xs space-y-1">
                          <p className="text-gray-700 leading-relaxed">{order.findings || 'Formalin fixed tissue section stained with Fontana-Masson & H&E.'}</p>
                          {isFinalized && (
                            <p className="text-emerald-700 font-semibold pt-1 border-t border-rose-100">
                              ✓ Signed off by {order.pathologist || 'Dr. Victor Chen, PhD'}
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

      {/* Printable Histology Certificate Modal */}
      {selectedLabForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Official Dermatopathology Report</h3>
                <p className="text-xs text-gray-500">Histology & Tissue Biopsy Diagnostic Summary</p>
              </div>
              <button 
                onClick={() => setSelectedLabForPrint(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-gray-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <div>
                  <p className="text-gray-400 font-medium">Patient</p>
                  <p className="font-bold text-gray-900 text-sm">{selectedLabForPrint.patientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-medium">Biopsy ID</p>
                  <p className="font-mono font-bold text-rose-700">{selectedLabForPrint.id}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-1">Specimen Site:</p>
                <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  {selectedLabForPrint.anatomicalSite || 'Cutaneous Scalp Tissue'} ({selectedLabForPrint.testType})
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-1">Microscopic Pathologist Assessment:</p>
                <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200 leading-relaxed">
                  {selectedLabForPrint.findings}
                </p>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between text-gray-500 text-[11px]">
                <span>Pathologist: Dr. Victor Chen, PhD</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => setSelectedLabForPrint(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => { window.print(); setSelectedLabForPrint(null); }}
                className="px-4 py-2 bg-[#306CE9] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
