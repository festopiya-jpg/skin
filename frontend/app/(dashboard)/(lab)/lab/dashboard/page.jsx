'use client';

import { useState, useEffect } from 'react';
import { Microscope, CheckCircle, Clock, TestTube2, AlertTriangle, MapPin, FileSearch } from 'lucide-react';
import { initHospitalStore } from '@/lib/hospitalStore';

export default function LabDashboard() {
  const [queue, setQueue] = useState([]);

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
    const updatedQueue = queue.map(q => {
      if (q.id === id) {
        return { 
          ...q, 
          status: 'Histopathology Finalized', 
          completedAt: new Date().toLocaleTimeString(),
          findings: (q.findings || '') + ' — Microscopic verification: Clear surgical margins confirmed.'
        };
      }
      return q;
    });
    setQueue(updatedQueue);
    localStorage.setItem('pending_lab', JSON.stringify(updatedQueue));
  };

  const pendingTests = queue.filter(q => q.status !== 'Histopathology Finalized');
  const completedTests = queue.filter(q => q.status === 'Histopathology Finalized');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
              <Microscope className="w-8 h-8" />
            </div>
            Dermatopathology & Biopsy Lab
          </h1>
          <p className="text-gray-500 mt-1">Histological tissue analysis, punch biopsies, and immunohistochemistry processing desk.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-center shadow-sm">
            <span className="text-xs text-gray-400 block font-semibold uppercase">Pending Analysis</span>
            <span className="text-xl font-bold text-rose-600">{pendingTests.length}</span>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-center shadow-sm">
            <span className="text-xs text-gray-400 block font-semibold uppercase">Completed</span>
            <span className="text-xl font-bold text-emerald-600">{completedTests.length}</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center bg-white/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Biopsy Specimen Registry</h2>
            <p className="text-xs text-gray-500">Ordered by attending physicians following 3D dermoscopic lesion evaluation</p>
          </div>
        </div>

        <div className="p-6">
          {queue.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-600 font-semibold text-lg">No pending biopsy specimens</p>
              <p className="text-xs text-gray-400 mt-1">When doctors order histology from the Doctor Queue, punch biopsy orders arrive here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {queue.map((order) => {
                const patientName = order.patientName || order.name || 'Patient';
                const isFinalized = order.status === 'Histopathology Finalized';

                return (
                  <div 
                    key={order.id} 
                    className={`border rounded-2xl p-6 transition-all ${
                      isFinalized 
                        ? 'bg-emerald-50/20 border-emerald-200' 
                        : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg font-bold text-gray-900">{patientName}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            {order.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isFinalized ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {order.status || 'Specimen Received'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Ordering Doctor: <span className="font-semibold text-gray-700">{order.doctorName || 'Dr. Sarah Mercer, MD'}</span> • Date: {order.date || 'Today'}
                        </p>
                      </div>

                      <div>
                        {!isFinalized ? (
                          <button 
                            onClick={() => handleCompleteTest(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                          >
                            <TestTube2 className="w-5 h-5" />
                            Finalize Pathology Report
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg">
                            <CheckCircle className="w-4 h-4" /> Lab Findings Released
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Test Type & Pathology</span>
                        <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl">
                          <p className="text-sm font-bold text-gray-800">{order.testType || 'Punch Biopsy & Histopathology'}</p>
                          <p className="text-xs text-rose-600 font-semibold mt-1">Priority: {order.priority || 'STAT'}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Anatomical Lesion Site</span>
                        <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">{order.anatomicalSite || 'Cutaneous Tissue'}</p>
                            <p className="text-xs text-gray-400">Marked on 3D Body Mesh</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Technician Notes & Protocol</span>
                        <div className="bg-rose-50/50 border border-rose-100 p-3.5 rounded-xl text-xs text-gray-700">
                          {order.findings || 'Formalin fixed, paraffin-embedded tissue section stained with hematoxylin & eosin.'}
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
