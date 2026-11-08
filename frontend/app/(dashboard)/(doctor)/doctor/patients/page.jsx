'use client';

import { useState, useEffect } from 'react';
import { Users, Search, AlertTriangle, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getDiagnoses, initHospitalStore } from '@/lib/hospitalStore';

export default function PatientsQueue() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initHospitalStore();
    const queue = getDiagnoses();
    setPatients(queue);
  }, []);

  const filteredPatients = patients.filter(p => {
    const name = p.patientName || p.name || '';
    const cond = p.condition || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || cond.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Patient Directory</h1>
          <p className="text-gray-500 mt-1">Real-time registry of patients undergoing automated AI dermoscopy and clinical review.</p>
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
        <div className="p-6 border-b border-gray-200/50 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Users className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Clinical Pathology & Patient Queue</h2>
              <p className="text-xs text-gray-500">{filteredPatients.length} active patient cases in clinic system</p>
            </div>
          </div>
          <Link
            href="/doctor/dashboard"
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            Review in Clinical Desk <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Patient Details</th>
                <th className="px-6 py-4 font-semibold">AI Diagnosis</th>
                <th className="px-6 py-4 font-semibold">3D Lesion Site</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    No active patients found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, idx) => {
                  const pName = patient.patientName || patient.name || 'Patient';
                  const isSevere = patient.severity === 'Severe' || patient.severity === 'High Risk' || patient.risk === 'High';
                  return (
                    <tr key={patient.id || idx} className="hover:bg-blue-50/20 transition-colors bg-white">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {pName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{pName}</span>
                            <span className="text-xs text-gray-500 block">Doctor: Dr. Sarah Mercer, MD</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-medium block">{patient.condition}</span>
                        <span className="text-xs text-gray-500 block">{patient.time || patient.date || 'Today'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          {patient.bodyPart || 'Cutaneous Lesion'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isSevere ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {patient.severity || 'Moderate'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {patient.status || 'Pending Review'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href="/doctor/dashboard"
                          className="text-xs bg-[#306CE9] hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm font-semibold inline-block"
                        >
                          Review Lesion
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
