'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { downloadClinicalReportPdf } from '@/lib/pdfGenerator';

const DEFAULT_PATIENT_RECORDS = [
  {
    id: 'REC-1092',
    patientName: 'Eleanor Vance',
    condition: 'Atypical Melanocytic Proliferation',
    doctorName: 'Dr. Sarah Mercer, MD',
    date: new Date().toLocaleDateString(),
    returnCode: 'VISIT-7A99B2',
    anatomicalSite: 'Head (Left Temporal Scalp)'
  }
];

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('patient_records');
    if (saved && JSON.parse(saved).length > 0) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords(DEFAULT_PATIENT_RECORDS);
      localStorage.setItem('patient_records', JSON.stringify(DEFAULT_PATIENT_RECORDS));
    }
  }, []);

  const handleDownloadPdf = (record) => {
    setDownloadingId(record.id || record.returnCode);
    try {
      downloadClinicalReportPdf({
        reportId: record.returnCode || 'DX-8921',
        patientName: record.patientName || 'Eleanor Vance',
        anatomicalSite: record.anatomicalSite || 'Cutaneous Scalp Lesion',
        primaryDiagnosis: record.condition || 'Atypical Melanocytic Proliferation',
        doctorName: record.doctorName || 'Dr. Sarah Mercer, MD',
        returnCode: record.returnCode || 'VISIT-7A99B2',
        timestamp: record.date || new Date().toLocaleDateString()
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Medical Records & Pathology Reports</h1>
        <p className="text-gray-500 mt-1">Access your verified clinical consultation history, AI diagnostics, and downloadable PDF reports.</p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-[#306CE9] w-5 h-5" />
            Verified Consultations & Pathology
          </h2>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            {records.length} Recorded Visits
          </span>
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
                      <ShieldCheck className="w-3 h-3" /> AI & Physician Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm inline-flex">
                    <img src={`/doctors/doc${(idx % 2) + 1}.jpg`} alt={record.doctorName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Attending Physician</p>
                      <p className="text-gray-900 font-bold text-sm">{record.doctorName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-56 flex flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right w-full">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Authenticated Return Code</p>
                    <div className="bg-gray-100 text-gray-900 font-mono text-base px-4 py-2 rounded-lg border border-gray-200 text-center tracking-widest font-bold">
                      {record.returnCode}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownloadPdf(record)}
                    disabled={downloadingId === (record.id || record.returnCode)}
                    className="w-full bg-[#306CE9] hover:bg-blue-700 text-white text-sm py-2.5 px-4 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> 
                    {downloadingId === (record.id || record.returnCode) ? 'Generating PDF...' : 'Download Official PDF'}
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
