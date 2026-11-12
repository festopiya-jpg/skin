'use client';

import { useState, useEffect } from 'react';
import { 
  Users, AlertTriangle, FileCheck, Search, Sparkles, X, 
  MapPin, CheckCircle, Pill, Microscope, FileText, Send, Check,
  Camera, Eye
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { 
  getDiagnoses, 
  initHospitalStore, 
  createPrescriptionOrder, 
  createLabOrder 
} from '@/lib/hospitalStore';

export default function DoctorDashboard() {
  const [patientQueue, setPatientQueue] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState({ name: 'Dr. Sarah Mercer, MD', status: 'APPROVED' });
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [actionNotice, setActionNotice] = useState('');

  // Prescription Modal State
  const [prescribePatient, setPrescribePatient] = useState(null);
  const [rxMedName, setRxMedName] = useState('Imiquimod 5% Topical Cream');
  const [rxDosage, setRxDosage] = useState('Apply once nightly 3x per week');
  const [rxQuantity, setRxQuantity] = useState('1 box (12 sachets)');
  const [rxInstructions, setRxInstructions] = useState('Counsel patient on localized erythema and sun protection.');

  // Lab Order Modal State
  const [labPatient, setLabPatient] = useState(null);
  const [labTestType, setLabTestType] = useState('Punch Biopsy Histopathology & Fontana-Masson Stain');
  const [labPriority, setLabPriority] = useState('STAT (High Priority)');
  const [labSite, setLabSite] = useState('');
  const [labInstructions, setLabInstructions] = useState('Evaluate microscopic surgical margins. Rule out melanoma in-situ.');

  const loadDoctorQueue = () => {
    initHospitalStore();
    const queue = getDiagnoses();
    setPatientQueue(queue);
    
    // Load session info
    if (typeof window !== 'undefined') {
      const session = JSON.parse(localStorage.getItem('session_user') || '{}');
      if (session.name) {
        setDoctorProfile({
          name: session.name.startsWith('Dr.') ? session.name : `Dr. ${session.name}`,
          status: session.status || 'APPROVED'
        });
      }
    }
  };

  useEffect(() => {
    loadDoctorQueue();
  }, []);

  const generateReturnCode = (patient) => {
    const code = 'VISIT-' + Date.now().toString(36).slice(-6).toUpperCase();
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
    
    // Remove from pending queue
    const updatedQueue = patientQueue.filter(p => p.id !== patient.id);
    setPatientQueue(updatedQueue);
    localStorage.setItem('pending_diagnoses', JSON.stringify(updatedQueue));
    return code;
  };

  const handleSendPrescription = (e) => {
    e.preventDefault();
    if (!prescribePatient) return;
    const pName = prescribePatient.patientName || prescribePatient.name || 'Patient';

    createPrescriptionOrder({
      patientName: pName,
      doctorName: doctorProfile.name,
      condition: prescribePatient.condition,
      medications: [
        { name: rxMedName, dosage: rxDosage, quantity: rxQuantity }
      ],
      pharmacyNotes: rxInstructions
    });

    const code = generateReturnCode(prescribePatient);
    setActionNotice(`✓ Prescription for ${pName} sent directly to Hospital Pharmacy! Return Code: ${code}`);
    setPrescribePatient(null);
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleSendLabOrder = (e) => {
    e.preventDefault();
    if (!labPatient) return;
    const pName = labPatient.patientName || labPatient.name || 'Patient';

    createLabOrder({
      patientName: pName,
      doctorName: doctorProfile.name,
      testType: labTestType,
      anatomicalSite: labSite || labPatient.bodyPart || 'Cutaneous Lesion',
      priority: labPriority,
      findings: labInstructions
    });

    const code = generateReturnCode(labPatient);
    setActionNotice(`✓ Punch biopsy ordered for ${pName} and dispatched directly to Pathology Lab! Return Code: ${code}`);
    setLabPatient(null);
    setTimeout(() => setActionNotice(''), 5000);
  };

  const signOffCase = (patient) => {
    const pName = patient.patientName || patient.name || 'Patient';
    const code = generateReturnCode(patient);
    setActionNotice(`✓ Consultation signed off for ${pName}. Patient Return Code: ${code}`);
    setTimeout(() => setActionNotice(''), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xl border-2 border-blue-200 shrink-0">
            {doctorProfile.name.charAt(3) || 'D'}
          </div>
          <div>
            <h1 className="text-3xl font-bold font-serif-hospital text-[#07213A]">Physician Clinical Desk</h1>
            <p className="text-gray-500 text-xs mt-1">
              Logged in: <strong className="text-gray-800">{doctorProfile.name}</strong> • Status: <span className="text-emerald-700 font-semibold">{doctorProfile.status}</span> • Active Clinical Queue
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search patient evaluations..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#306CE9]"
          />
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pending Clinical Queue</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{patientQueue.length}</p>
        </div>
        <div className="bg-white border border-rose-200 p-5 rounded-2xl shadow-sm bg-rose-50/20">
          <p className="text-rose-600 text-xs font-semibold uppercase tracking-wider">High Risk Lesions</p>
          <p className="text-3xl font-black text-rose-600 mt-1">
            {patientQueue.filter(p => p.severity === 'Severe' || p.severity === 'High Risk' || p.risk === 'High' || p.riskScore > 7).length}
          </p>
        </div>
        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-sm bg-emerald-50/20">
          <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Credential Verification</p>
          <p className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-1.5">
            <CheckCircle className="w-6 h-6 inline" /> {doctorProfile.status}
          </p>
        </div>
      </div>

      {/* Patient Queue & Pending Reviews */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold font-serif-hospital text-[#07213A]">Today's Patient Evaluations & AI Dermoscopy</h2>
            <p className="text-xs text-gray-500">Review lesion analysis, write e-prescriptions to Pharmacy, or dispatch punch biopsies to Pathology Lab.</p>
          </div>
          <Link href="/doctor/patients" className="text-xs text-[#306CE9] hover:underline font-bold">
            View All Patients
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">AI Diagnosis</th>
                <th className="px-6 py-4 font-semibold">Lesion Site</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold text-right">Physician Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patientQueue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500/40" />
                    <p className="font-bold text-gray-700 text-sm">All patient evaluations currently signed off.</p>
                    <p className="text-xs mt-1">New scans uploaded by patients will stream here automatically.</p>
                  </td>
                </tr>
              ) : (
                patientQueue.map((patient) => {
                  const patientName = patient.patientName || patient.name || 'Patient';
                  const isSevere = patient.severity === 'Severe' || patient.severity === 'High Risk' || (patient.riskScore && patient.riskScore > 7);

                  return (
                    <tr key={patient.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{patientName}</div>
                        <div className="text-xs text-gray-400 font-mono">PID-{String(patient.id).slice(-4)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 text-xs">{patient.condition}</div>
                        {patient.confidence && (
                          <div className="text-[11px] text-blue-600 font-medium">Confidence: {patient.confidence}%</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          {patient.bodyPart || 'Cutaneous Lesion'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          isSevere ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {patient.severity || 'Moderate'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {patient.image && (
                            <button 
                              onClick={() => setViewingPhoto(patient)}
                              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                              title="Inspect Patient Uploaded Disease / Lesion Photo"
                            >
                              <Camera className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Photo</span>
                            </button>
                          )}
                          {patient.research && (
                            <button 
                              onClick={() => setSelectedResearch(patient.research)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                              title="View Pathology Literature Research Dossier"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Dossier</span>
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setPrescribePatient(patient);
                              setRxInstructions(`Prescription issued by ${doctorProfile.name} following dermoscopic evaluation.`);
                            }}
                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm font-semibold flex items-center gap-1 cursor-pointer"
                            title="Write medication & send to Pharmacy"
                          >
                            <Pill className="w-3.5 h-3.5" />
                            <span>Prescribe Meds</span>
                          </button>
                          <button 
                            onClick={() => {
                              setLabPatient(patient);
                              setLabSite(patient.bodyPart || 'Cutaneous Lesion');
                            }}
                            className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm font-semibold flex items-center gap-1 cursor-pointer"
                            title="Order biopsy & send to Pathology Lab"
                          >
                            <Microscope className="w-3.5 h-3.5" />
                            <span>Order Lab</span>
                          </button>
                          <button 
                            onClick={() => signOffCase(patient)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm font-semibold flex items-center gap-1 cursor-pointer"
                            title="Sign-off and complete consultation"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Sign Off</span>
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

      {/* MODAL 1: PRESCRIBE MEDICATION (SEND TO PHARMACY) */}
      {prescribePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-600" />
                  Prescribe Medication (Send to Pharmacy)
                </h3>
                <p className="text-xs text-gray-500">
                  Patient: <strong className="text-gray-900">{prescribePatient.patientName || prescribePatient.name}</strong> • Condition: {prescribePatient.condition}
                </p>
              </div>
              <button onClick={() => setPrescribePatient(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendPrescription} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  value={rxMedName}
                  onChange={(e) => setRxMedName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Imiquimod 5% Topical Cream"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Dosage & Frequency</label>
                  <input
                    type="text"
                    required
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Once daily at bedtime"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Quantity</label>
                  <input
                    type="text"
                    required
                    value={rxQuantity}
                    onChange={(e) => setRxQuantity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 1 tube (30g)"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Pharmacist Instructions & Patient Counseling</label>
                <textarea
                  rows={2}
                  value={rxInstructions}
                  onChange={(e) => setRxInstructions(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Notes for Elena Rostova, PharmD at Pharmacy Desk..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setPrescribePatient(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch to Pharmacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER BIOPSY (SEND TO LAB) */}
      {labPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-rose-600" />
                  Order Histopathology Biopsy (Send to Lab)
                </h3>
                <p className="text-xs text-gray-500">
                  Patient: <strong className="text-gray-900">{labPatient.patientName || labPatient.name}</strong> • Site: {labPatient.bodyPart}
                </p>
              </div>
              <button onClick={() => setLabPatient(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendLabOrder} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Pathology Test Type</label>
                <input
                  type="text"
                  required
                  value={labTestType}
                  onChange={(e) => setLabTestType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g. Punch Biopsy Histopathology & Fontana-Masson Stain"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Anatomical Lesion Site</label>
                  <input
                    type="text"
                    required
                    value={labSite}
                    onChange={(e) => setLabSite(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-rose-500"
                    placeholder="e.g. Left Temporal Scalp"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Priority</label>
                  <select
                    value={labPriority}
                    onChange={(e) => setLabPriority(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="STAT (High Priority)">STAT (High Priority)</option>
                    <option value="Urgent (24-48 Hours)">Urgent (24-48 Hours)</option>
                    <option value="Routine Histology">Routine Histology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Clinical Indication & Margin Instructions</label>
                <textarea
                  rows={2}
                  value={labInstructions}
                  onChange={(e) => setLabInstructions(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-rose-500"
                  placeholder="Notes for Dr. Victor Chen, PhD at Dermatopathology Lab..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setLabPatient(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch to Pathology Lab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clinical Pathology Research Modal */}
      {selectedResearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
              <ReactMarkdown>
                {selectedResearch}
              </ReactMarkdown>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 p-4 shrink-0 flex justify-end">
              <button
                onClick={() => setSelectedResearch(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors text-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PATIENT DISEASE PHOTO INSPECTION MODAL */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200">
            <div className="bg-[#07213A] p-5 flex justify-between items-center text-white shrink-0">
              <div>
                <h3 className="text-base font-bold font-serif-hospital flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  Patient Uploaded Lesion & Disease Photo
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Patient: <strong className="text-white">{viewingPhoto.patientName || viewingPhoto.name}</strong> • Site: {viewingPhoto.bodyPart || 'Unspecified'}
                </p>
              </div>
              <button 
                onClick={() => setViewingPhoto(null)}
                className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-900 border border-gray-200 shadow-inner flex items-center justify-center">
                <img 
                  src={viewingPhoto.image} 
                  alt="Patient Lesion Photo" 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-gray-500 uppercase font-bold text-[10px] block font-mono">Reported Condition</span>
                  <span className="font-bold text-gray-900 mt-0.5 block">{viewingPhoto.condition}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase font-bold text-[10px] block font-mono">Triage Severity</span>
                  <span className="font-bold text-rose-600 mt-0.5 block">{viewingPhoto.severity || 'Moderate'}</span>
                </div>
              </div>

              {viewingPhoto.abcde && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5 text-xs">
                  <p className="font-bold text-blue-950 uppercase text-[10px] tracking-wider">ABCDE Dermoscopic Biomarkers</p>
                  <p className="text-gray-700"><strong>Asymmetry:</strong> {viewingPhoto.abcde.a}</p>
                  <p className="text-gray-700"><strong>Border:</strong> {viewingPhoto.abcde.b}</p>
                  <p className="text-gray-700"><strong>Color:</strong> {viewingPhoto.abcde.c}</p>
                  <p className="text-gray-700"><strong>Diameter:</strong> {viewingPhoto.abcde.d}</p>
                  <p className="text-gray-700"><strong>Evolution:</strong> {viewingPhoto.abcde.e}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const p = viewingPhoto;
                  setViewingPhoto(null);
                  setPrescribePatient(p);
                  setRxInstructions(`Prescription issued by ${doctorProfile.name} following lesion photo evaluation.`);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Pill className="w-3.5 h-3.5" />
                <span>Prescribe Meds</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = viewingPhoto;
                  setViewingPhoto(null);
                  setLabPatient(p);
                  setLabSite(p.bodyPart || 'Cutaneous Lesion');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>Order Biopsy</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingPhoto(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}