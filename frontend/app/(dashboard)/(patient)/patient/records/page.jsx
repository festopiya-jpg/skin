'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, ShieldCheck } from 'lucide-react';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(JSON.parse(localStorage.getItem('patient_records') || '[]'));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-gray-500 mt-1">Access your consultation history, AI diagnostics, and return codes.</p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#306CE9] w-5 h-5" />
            Past Visits
          </h2>
        </div>
        
        {records.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No medical records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {records.map((record, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{record.condition}</h3>
                      <p className="text-sm text-gray-500">{record.date}</p>
                    </div>
                    <span className="bg-blue-50 text-[#306CE9] px-3 py-1 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> AI Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm inline-flex">
                    <img src={`/doctors/doc${(idx % 2) + 1}.jpg`} alt={record.doctorName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Attending Doctor</p>
                      <p className="text-gray-900 font-bold text-sm">{record.doctorName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-48 flex flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right w-full">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Return Code</p>
                    <div className="bg-gray-100 text-gray-900 font-mono text-lg px-4 py-2 rounded-lg border border-gray-200 text-center tracking-widest font-bold">
                      {record.returnCode}
                    </div>
                  </div>
                  <button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#306CE9] text-sm py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
