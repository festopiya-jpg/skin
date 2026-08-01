'use client';

import { useState, useEffect } from 'react';
import { Users, Search, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PatientsQueue() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load dynamically submitted diagnoses from Patient Dashboard via localStorage
    const saved = localStorage.getItem('pending_diagnoses');
    if (saved) {
      setPatients(JSON.parse(saved));
    }
  }, []);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.condition.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Patients</h1>
          <p className="text-gray-500 mt-1">View the complete list of patient consultations and AI diagnostic results.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by patient name or condition..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 flex items-center gap-3 bg-white/50">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Users className="text-emerald-600 w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Patient Directory</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Patient Details</th>
                <th className="px-6 py-4 font-medium">AI Diagnosis</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No patients found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, idx) => (
                  <tr key={idx} className="hover:bg-white/50 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{patient.name}</span>
                          <span className="text-xs text-gray-500 block">Assigned to: Dr. {patient.assignedDoctorName || 'Smith'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium block">{patient.condition}</span>
                      <span className="text-xs text-gray-500 block">Uploaded at: {patient.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold w-max ${
                        patient.severity === 'Severe' ? 'bg-rose-100 text-rose-700' :
                        patient.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {patient.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href="/doctor/dashboard"
                        className="text-xs bg-[#306CE9] hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium inline-block"
                      >
                        Action Required
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
