'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Activity, Server, ShieldCheck, CalendarClock, Send, 
  CheckCircle2, Clock, MapPin, Stethoscope, AlertTriangle, 
  Building2, Bed, Pill, Microscope, Sparkles, RefreshCw
} from 'lucide-react';
import { 
  getHospitalMetrics, 
  getDoctors, 
  approveDoctor, 
  revokeDoctor, 
  getAppointments, 
  confirmAppointment, 
  getDiagnoses 
} from '@/lib/hospitalStore';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [requests, setRequests] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  
  // Form states per request ID
  const [appointmentDates, setAppointmentDates] = useState({});
  const [assignedRooms, setAssignedRooms] = useState({});
  const [messages, setMessages] = useState({});

  const reloadData = () => {
    setMetrics(getHospitalMetrics());
    const docList = getDoctors();
    setDoctors(docList);
    const apts = getAppointments();
    setRequests(apts.requests);
    setScheduled(apts.scheduled);
    setDiagnoses(getDiagnoses());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleApproveDoc = (email) => {
    approveDoctor(email);
    reloadData();
  };

  const handleRevokeDoc = (email) => {
    revokeDoctor(email);
    reloadData();
  };

  const handleConfirmRequest = (req) => {
    const datetime = appointmentDates[req.id] || new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const room = assignedRooms[req.id] || 'Consultation Suite 304';
    const notes = messages[req.id] || 'Please arrive 10 minutes early. Skin lesion 3D pre-scan attached to file.';

    confirmAppointment(req.id, {
      datetime,
      room,
      notes,
      doctorName: req.doctorName
    });

    reloadData();
  };

  const pendingDoctors = doctors.filter(d => d.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header & Hospital Administrator Profile */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-gradient-to-r from-slate-900 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-blue-900/40">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-2xl shadow-inner">
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hospital Admin Control Tower</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SYSTEM ACTIVE
              </span>
            </div>
            <p className="text-slate-300 text-xs md:text-sm mt-1">
              Metropolitan Dermatology & Clinical Health Institute • Facility ID: <span className="font-mono text-cyan-300">HOSP-NY-8402</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={reloadData}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 border border-slate-700"
            title="Refresh Hospital Metrics"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Live Sync</span>
          </button>
          <Link
            href="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Staff & Users</span>
          </Link>
        </div>
      </div>

      {/* Real-time KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-blue-600 bg-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Patients</p>
            <Users className="text-[#306CE9] w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{metrics?.totalPatients || '4,821'}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ Active Clinical Registry</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-indigo-600 bg-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">AI Scans Processed</p>
            <Activity className="text-indigo-600 w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{metrics?.totalDiagnosesRun || '12,403'}</p>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Computer-Vision Ensemble</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500 bg-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pending Bookings</p>
            <CalendarClock className="text-amber-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{requests.length}</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Requires Admin Dispatch</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500 bg-white">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Bed & Room Load</p>
            <Bed className="text-emerald-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{metrics?.bedOccupancy || '78%'}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Operational Capacity</p>
        </div>
      </div>

      {/* Doctor Licensing & Verification Queue */}
      <div className="glass-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Physician Licensing & Credentialing</h2>
              <p className="text-xs text-gray-500">Verify physician licenses, specialties, and hospital room assignments.</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-mono">
            {doctors.filter(d => d.status === 'APPROVED').length} Certified Active
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition-all shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      doc.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {doc.status}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">{doc.npi || 'NPI-VERIFIED'}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">{doc.name}</h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{doc.specialty}</p>
                  <p className="text-xs text-gray-500 mt-2 font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{doc.hospitalRoom || 'Suite 304'}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{doc.email}</span>
                  {doc.status === 'PENDING' ? (
                    <button 
                      onClick={() => handleApproveDoc(doc.email)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Approve Doctor
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRevokeDoc(doc.email)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Scheduling Desk */}
      <div className="glass-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hospital Appointment Dispatch Desk</h2>
              <p className="text-xs text-gray-500">Incoming patient consultation bookings needing schedule & room assignment.</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-mono">
            {requests.length} Pending Actions
          </span>
        </div>
        
        <div className="p-6">
          {requests.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="font-bold text-gray-900">All Appointments Scheduled</h3>
              <p className="text-gray-500 text-xs mt-1">There are no pending patient bookings in the hospital intake queue.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {requests.map((req) => (
                <div key={req.id} className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-blue-300 transition-all flex flex-col lg:flex-row gap-6 shadow-sm">
                  
                  {/* Request Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-extrabold text-lg">{req.patientName}</span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong className="text-gray-800">Requested Specialist:</strong> {req.doctorName}</p>
                      <p><strong className="text-gray-800">Lesion Location:</strong> <span className="font-bold text-blue-600">{req.lesionLocation || 'Torso'}</span></p>
                      <p><strong className="text-gray-800">Clinical Reason:</strong> {req.reason || 'Dermatological screening'}</p>
                      <p className="text-[11px] text-gray-400 font-mono">Booking Ref: {req.id}</p>
                    </div>
                  </div>

                  {/* Scheduling Fields */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Consultation Time
                      </label>
                      <input 
                        type="datetime-local" 
                        value={appointmentDates[req.id] || ''}
                        onChange={(e) => setAppointmentDates(prev => ({...prev, [req.id]: e.target.value}))}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Assign Room / Suite
                      </label>
                      <input 
                        type="text"
                        value={assignedRooms[req.id] || ''}
                        onChange={(e) => setAssignedRooms(prev => ({...prev, [req.id]: e.target.value}))}
                        placeholder="Suite 304 - Telehealth A"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                        Instructions to Patient
                      </label>
                      <input 
                        type="text"
                        value={messages[req.id] || ''}
                        onChange={(e) => setMessages(prev => ({...prev, [req.id]: e.target.value}))}
                        placeholder="Please arrive 10 minutes early with pre-scan uploaded."
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col justify-end items-end gap-2 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                    <button 
                      onClick={() => handleConfirmRequest(req)}
                      className="w-full lg:w-44 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirm & Send</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hospital Diagnostic Audit Log */}
      <div className="glass-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-700">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hospital Pathology & XAI Audit Registry</h2>
              <p className="text-xs text-gray-500">Live feed of dermatological neural matrix classifications across all patients.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {diagnoses.length} Cases Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <th className="px-6 py-3 font-semibold">Case ID</th>
                <th className="px-6 py-3 font-semibold">Patient</th>
                <th className="px-6 py-3 font-semibold">3D Body Region</th>
                <th className="px-6 py-3 font-semibold">AI Prediction</th>
                <th className="px-6 py-3 font-semibold">Severity</th>
                <th className="px-6 py-3 font-semibold">Assigned Doctor</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {diagnoses.map((dx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{dx.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{dx.patientName}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {dx.bodyPart || 'Head'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{dx.condition}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {dx.severity || 'Urgent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{dx.assignedDoctorName}</td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {dx.status}
                    </span>
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