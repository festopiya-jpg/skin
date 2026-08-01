'use client';

import { useState, useEffect } from 'react';
import { Users, AlertTriangle, FileCheck, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function DoctorDashboard() {
  const [patientQueue, setPatientQueue] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState({ name: 'Smith', status: 'APPROVED' });
  const [selectedResearch, setSelectedResearch] = useState(null);

  useEffect(() => {
    // Load dynamically submitted diagnoses from Patient Dashboard via localStorage
    const saved = localStorage.getItem('pending_diagnoses');
    if (saved) {
      setPatientQueue(JSON.parse(saved));
    }
    
    // Load session info
    const session = JSON.parse(localStorage.getItem('session_user') || '{}');
    if (session.name) {
      // Find my status in system_doctors
      const docs = JSON.parse(localStorage.getItem('system_doctors') || '[]');
      const myProfile = docs.find(d => d.email === session.email) || {};
      setDoctorProfile({
        name: session.name,
        status: myProfile.status || 'APPROVED'
      });
    }
  }, []);

  const generateReturnCode = (patient) => {
    const code = 'VISIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newRecord = {
      id: Date.now(),
      patientName: patient.name,
      condition: patient.condition,
      doctorName: patient.assignedDoctorName || 'Smith',
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
    const saved = JSON.parse(localStorage.getItem('pending_medical') || '[]');
    localStorage.setItem('pending_medical', JSON.stringify([patient, ...saved]));
    const code = generateReturnCode(patient);
    alert(`Medication order sent to Pharmacy for ${patient.name}. Return code generated: ${code}`);
  };

  const orderLabs = (patient) => {
    const saved = JSON.parse(localStorage.getItem('pending_lab') || '[]');
    localStorage.setItem('pending_lab', JSON.stringify([patient, ...saved]));
    const code = generateReturnCode(patient);
    alert(`Lab tests ordered for ${patient.name}. Return code generated: ${code}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {doctorProfile.status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-sm font-medium">Your account is pending verification. Patients cannot book appointments with you until the Admin approves your profile.</p>
        </div>
      )}

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
              <p className="text-gray-500 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">1,248</p>
            </div>
            <Users className="text-[#306CE9]/50 w-10 h-10" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-rose-500 bg-rose-500/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical Reviews</p>
              <p className="text-3xl font-bold text-rose-600 mt-1">2</p>
            </div>
            <AlertTriangle className="text-rose-500/50 w-10 h-10" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">AI Accuracy (30d)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">94.5%</p>
            </div>
            <FileCheck className="text-emerald-500/50 w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Patient Queue & Pending Reviews */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Today's Queue & AI Insights</h2>
          <Link href="/doctor/patients" className="text-sm text-[#306CE9] hover:text-blue-700">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">AI Diagnosis</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Appointment</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {patientQueue.map((patient) => (
                <tr key={patient.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.condition}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      patient.severity === 'Severe' ? 'bg-rose-100 text-rose-600' : 
                      patient.severity === 'Moderate' ? 'bg-amber-100 text-amber-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {patient.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{patient.time}</td>
                  <td className="px-6 py-4">
                    {patient.status === 'Pending Review' ? (
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setSelectedResearch(patient.research)}
                          className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm font-bold flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          View Grok
                        </button>
                        <button 
                          onClick={() => approveMeds(patient)}
                          className="text-xs bg-[#306CE9] hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm font-medium"
                        >
                          Approve Meds
                        </button>
                        <button 
                          onClick={() => orderLabs(patient)}
                          className="text-xs bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm font-medium"
                        >
                          Order Labs
                        </button>
                      </div>
                    ) : (
                      <button className="text-xs bg-slate-700 hover:bg-gray-100 text-gray-900 px-3 py-1.5 rounded-lg transition-colors">
                        View Record
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grok AI Modal Popup for Doctor */}
      {selectedResearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Patient Grok AI Clinical Research Report
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