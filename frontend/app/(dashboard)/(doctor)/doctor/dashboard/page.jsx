'use client';

import { useState, useEffect } from 'react';
import { Users, AlertTriangle, FileCheck, Search, Sparkles, X, MapPin, CheckCircle, Pill, Microscope } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getDiagnoses, initHospitalStore, createPrescriptionOrder, createLabOrder } from '@/lib/hospitalStore';

export default function DoctorDashboard() {
  const [patientQueue, setPatientQueue] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState({ name: 'Dr. Sarah Mercer, MD', status: 'APPROVED' });
  const [selectedResearch, setSelectedResearch] = useState(null);

  const loadDoctorQueue = () => {
    initHospitalStore();
    const queue = getDiagnoses();
    setPatientQueue(queue);
    
    // Load session info
    const session = JSON.parse(localStorage.getItem('session_user') || '{}');
    if (session.name) {
      const docs = JSON.parse(localStorage.getItem('system_doctors') || '[]');
      const myProfile = docs.find(d => d.email === session.email) || {};
      setDoctorProfile({
        name: session.name.startsWith('Dr.') ? session.name : `Dr. ${session.name}`,
        status: myProfile.status || 'APPROVED'
      });
    }
  };

  useEffect(() => {
    loadDoctorQueue();
  }, []);

  const generateReturnCode = (patient) => {
    const code = 'VISIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const pName = patient.patientName || patient.name || 'Patient';
    const newRecord = {
      id: Date.now(),
      patientName: pName,
      condition: patient.condition,
      doctorName: doctorProfile.name,
      date: new Date().toLocaleDateString(),
      returnCode: code
    };
    const records = JSON.parse(localStorage.getItem('patient_records') || '[]');
    localStorage.setItem('patient_records', JSON.stringify([newRecord, ...records]));
    
    // Remove from Doctor's pending queue after checkup is complete
    const updatedQueue = patientQueue.filter(p => p.id !== patient.id);
    setPatientQueue(updatedQueue);
    localStorage.setItem('pending_diagnoses', JSON.stringify(updatedQueue));
    return code;
  };

  const approveMeds = (patient) => {
    const pName = patient.patientName || patient.name || 'Patient';
    createPrescriptionOrder({
      patientName: pName,
      doctorName: doctorProfile.name,
      condition: patient.condition,
      medications: [
        { name: 'Imiquimod 5% Topical Cream', dosage: 'Apply once nightly 3x/week', quantity: '1 box' },
        { name: 'Topical Corticosteroid 0.1%', dosage: 'Twice daily', quantity: '1 tube' }
      ],
      pharmacyNotes: `Prescription issued by ${doctorProfile.name} following 3D dermoscopy evaluation.`
    });
    const code = generateReturnCode(patient);
    alert(`Prescription successfully routed to Hospital Pharmacy for ${pName}. Visit Return Code: ${code}`);
  };

  const orderLabs = (patient) => {
    const pName = patient.patientName || patient.name || 'Patient';
    createLabOrder({
      patientName: pName,
      doctorName: doctorProfile.name,
      testType: 'Punch Biopsy Histopathology & Fontana-Masson Stain',
      anatomicalSite: patient.bodyPart || 'Cutaneous Lesion',
      priority: 'STAT (High Priority)',
      findings: `Biopsy ordered by ${doctorProfile.name} for microscopic margins check.`
    });
    const code = generateReturnCode(patient);
    alert(`Lab tests ordered and routed to Pathology Lab for ${pName}. Visit Return Code: ${code}`);
  };

  const signOffCase = (patient) => {
    const pName = patient.patientName || patient.name || 'Patient';
    const code = generateReturnCode(patient);
    alert(`Case signed off for ${pName}. Visit Return Code: ${code}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <img src="/doctors/doc1.jpg" alt={`Dr. ${doctorProfile.name}`} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, Dr. {doctorProfile.name}. You have {patientQueue.length} pending XAI reviews.</p>
          </div>
        </div>
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-sky-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Clinical Queue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{patientQueue.length}</p>
            </div>
            <Users className="text-[#306CE9]/50 w-10 h-10" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-rose-500 bg-rose-500/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">High Risk Lesions</p>
              <p className="text-3xl font-bold text-rose-600 mt-1">
                {patientQueue.filter(p => p.severity === 'Severe' || p.severity === 'High Risk' || p.risk === 'High').length}
              </p>
            </div>
            <AlertTriangle className="text-rose-500/50 w-10 h-10" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Doctor Status</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-6 h-6 inline" /> {doctorProfile.status || 'Active'}
              </p>
            </div>
            <FileCheck className="text-emerald-500/50 w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Patient Queue & Pending Reviews */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Today's Clinical Queue & XAI Diagnosis</h2>
            <p className="text-xs text-gray-500 mt-0.5">Live dermoscopy evaluations ready for clinical sign-off, pharmacy prescription, or pathology lab biopsy order.</p>
          </div>
          <Link href="/doctor/patients" className="text-sm text-[#306CE9] hover:text-blue-700 font-semibold">View All Patients</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">AI Diagnosis</th>
                <th className="px-6 py-4 font-semibold">3D Lesion Site</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">Scheduled</th>
                <th className="px-6 py-4 font-semibold text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patientQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500/40" />
                    <p className="font-medium text-gray-600">All patient evaluations currently signed off and cleared.</p>
                    <p className="text-xs mt-1">New AI scans from patients will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                patientQueue.map((patient) => {
                  const patientName = patient.patientName || patient.name || 'Patient';
                  const isSevere = patient.severity === 'Severe' || patient.severity === 'High Risk' || patient.risk === 'High';
                  return (
                    <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{patientName}</div>
                        <div className="text-xs text-gray-400 font-mono">PID-{String(patient.id).slice(-4)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{patient.condition}</div>
                        {patient.confidence && (
                          <div className="text-xs text-blue-600 font-medium">Confidence: {patient.confidence}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          {patient.bodyPart || 'Torso / Trunk'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isSevere ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {patient.severity || 'Moderate'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                        {patient.time || patient.date || 'Today'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {patient.research && (
                            <button 
                              onClick={() => setSelectedResearch(patient.research)}
                              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1 shadow-sm"
                              title="View Clinical Pathology Research Dossier"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              Pathology Dossier
                            </button>
                          )}
                          <button 
                            onClick={() => approveMeds(patient)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm font-semibold flex items-center gap-1"
                            title="Route e-prescription to Hospital Pharmacy"
                          >
                            <Pill className="w-3.5 h-3.5" />
                            Rx Meds
                          </button>
                          <button 
                            onClick={() => orderLabs(patient)}
                            className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm font-semibold flex items-center gap-1"
                            title="Order Histopathology punch biopsy from Lab"
                          >
                            <Microscope className="w-3.5 h-3.5" />
                            Order Lab
                          </button>
                          <button 
                            onClick={() => signOffCase(patient)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm font-semibold flex items-center gap-1"
                            title="Sign-off and complete consultation"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Sign Off
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Pathology Research Modal */}
      {selectedResearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Clinical Pathology & Literature Research Dossier
              </h2>
              <button 
                onClick={() => setSelectedResearch(null)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grok-markdown text-gray-800 space-y-4">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-2xl font-black text-indigo-900 mt-6 mb-3 border-b-2 border-indigo-100 pb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-600 leading-relaxed mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="marker:text-indigo-400" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                }}
              >
                {selectedResearch}
              </ReactMarkdown>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 p-4 shrink-0 flex justify-end">
              <button
                onClick={() => setSelectedResearch(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}