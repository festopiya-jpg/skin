'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Download, ShieldCheck, CheckCircle2, 
  Pill, Microscope, PackageCheck, TestTube2, Clock 
} from 'lucide-react';
import { downloadClinicalReportPdf } from '@/lib/pdfGenerator';
import { initHospitalStore } from '@/lib/hospitalStore';

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
  const [activeTab, setActiveTab] = useState('visits'); // 'visits', 'prescriptions', 'biopsies'
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    initHospitalStore();
    
    // 1. Consultation Visits
    const saved = localStorage.getItem('patient_records');
    if (saved && JSON.parse(saved).length > 0) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords(DEFAULT_PATIENT_RECORDS);
      localStorage.setItem('patient_records', JSON.stringify(DEFAULT_PATIENT_RECORDS));
    }

    // 2. Pharmacy Prescriptions
    const rxSaved = localStorage.getItem('pending_medical');
    if (rxSaved) {
      try {
        setPrescriptions(JSON.parse(rxSaved));
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Pathology Lab Orders
    const labSaved = localStorage.getItem('pending_lab');
    if (labSaved) {
      try {
        setLabOrders(JSON.parse(labSaved));
      } catch (e) {
        console.error(e);
      }
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
        <h1 className="text-3xl font-bold text-gray-900">Hospital Medical Records & Clinical Dossiers</h1>
        <p className="text-gray-500 mt-1">Verified patient records, physician sign-offs, pharmacy dispensations, and pathology biopsy findings.</p>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'visits' 
              ? 'bg-[#306CE9] text-white shadow-sm' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Doctor Consultations ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'prescriptions' 
              ? 'bg-[#306CE9] text-white shadow-sm' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Pharmacy Prescriptions ({prescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('biopsies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'biopsies' 
              ? 'bg-[#306CE9] text-white shadow-sm' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>Pathology Lab Biopsies ({labOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: DOCTOR CONSULTATIONS & PDF */}
      {activeTab === 'visits' && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-[#306CE9] w-5 h-5" />
              Verified Physician Consultations & AI Triage
            </h2>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {records.length} Recorded Visits
            </span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {records.map((record, idx) => (
              <div key={idx} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{record.condition}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Consultation Date: {record.date}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Physician Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm inline-flex">
                    <img src={`/doctors/doc${(idx % 2) + 1}.jpg`} alt={record.doctorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Attending Physician</p>
                      <p className="text-gray-900 font-bold text-sm">{record.doctorName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-56 flex flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Return Code</span>
                    <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                      {record.returnCode}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDownloadPdf(record)}
                    disabled={downloadingId === (record.id || record.returnCode)}
                    className="w-full bg-[#306CE9] hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadingId === (record.id || record.returnCode) ? 'Generating PDF...' : 'Download Official PDF'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PHARMACY PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Pill className="text-indigo-600 w-5 h-5" />
              Prescriptions & Pharmacy Fulfillment
            </h2>
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              Dispensary Desk
            </span>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            {prescriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No prescriptions on file.</div>
            ) : (
              prescriptions.map((rx) => {
                const isDispensed = rx.status === 'Dispensed';
                return (
                  <div key={rx.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{rx.patientName}</span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {rx.id}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isDispensed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {isDispensed ? 'Dispensed & Ready' : 'In Preparation'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Prescribed by {rx.doctorName} • Date: {rx.date}</p>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Array.isArray(rx.medications) && rx.medications.map((m, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                            💊 {m.name} ({m.dosage})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-medium">Pharmacist</span>
                      <span className="text-xs font-bold text-gray-800">{rx.pharmacist || 'Elena Rostova, PharmD'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PATHOLOGY LAB BIOPSIES */}
      {activeTab === 'biopsies' && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Microscope className="text-rose-600 w-5 h-5" />
              Pathology Tissue Biopsies & Histology
            </h2>
            <span className="text-xs font-semibold px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
              Histopathology Lab
            </span>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            {labOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No biopsy orders on file.</div>
            ) : (
              labOrders.map((lab) => {
                const isFinal = lab.status === 'Histopathology Finalized';
                return (
                  <div key={lab.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{lab.testType}</span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          {lab.id}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isFinal ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {isFinal ? 'Histology Released' : 'Processing Biopsy'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Site: <strong className="text-gray-700">{lab.anatomicalSite}</strong> • Ordered by: {lab.doctorName}
                      </p>
                      <p className="text-xs text-gray-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 max-w-xl">
                        🔬 {lab.findings}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-medium">Dermatopathologist</span>
                      <span className="text-xs font-bold text-gray-800">{lab.pathologist || 'Dr. Victor Chen, PhD'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}
