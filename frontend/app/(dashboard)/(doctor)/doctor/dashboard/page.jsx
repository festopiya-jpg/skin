'use client';

import { useState, useEffect } from 'react';
import { Users, AlertTriangle, FileCheck, Search } from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboard() {
  const [patientQueue, setPatientQueue] = useState([]);

  useEffect(() => {
    // Load dynamically submitted diagnoses from Patient Dashboard via localStorage
    const saved = localStorage.getItem('pending_diagnoses');
    if (saved) {
      setPatientQueue(JSON.parse(saved));
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, Dr. Smith. You have 2 pending XAI reviews.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-sky-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-white mt-1">1,248</p>
            </div>
            <Users className="text-sky-500/50 w-10 h-10" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-rose-500 bg-rose-500/5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm font-medium">Critical Reviews</p>
              <p className="text-3xl font-bold text-rose-400 mt-1">2</p>
            </div>
            <AlertTriangle className="text-rose-500/50 w-10 h-10" />
          </div>
        </div>
        <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm font-medium">AI Accuracy (30d)</p>
              <p className="text-3xl font-bold text-white mt-1">94.5%</p>
            </div>
            <FileCheck className="text-emerald-500/50 w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Patient Queue & Pending Reviews */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Today's Queue & AI Insights</h2>
          <Link href="/doctor/patients" className="text-sm text-sky-400 hover:text-sky-300">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-700">
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">AI Diagnosis</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Appointment</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {patientQueue.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{patient.name}</td>
                  <td className="px-6 py-4 text-slate-300">{patient.condition}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      patient.severity === 'Severe' ? 'bg-rose-500/20 text-rose-400' : 
                      patient.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {patient.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{patient.time}</td>
                  <td className="px-6 py-4">
                    {patient.status === 'Pending Review' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => approveMeds(patient)}
                          className="text-xs bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          Approve Meds
                        </button>
                        <button 
                          onClick={() => orderLabs(patient)}
                          className="text-xs bg-rose-500 hover:bg-rose-400 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          Order Labs
                        </button>
                      </div>
                    ) : (
                      <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors">
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
    </div>
  );
}