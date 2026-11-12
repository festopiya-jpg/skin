'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Activity, ShieldCheck, CalendarClock, Send, 
  CheckCircle2, Clock, MapPin, Stethoscope, AlertTriangle, 
  Building2, Bed, Pill, Microscope, Sparkles, RefreshCw, 
  Mail, X, CreditCard, ExternalLink, Check, UserCheck 
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
  const [sentEmailModal, setSentEmailModal] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

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

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleApproveDoc = (email, name) => {
    approveDoctor(email);
    reloadData();
    showToast(`✓ ${name || 'Doctor'} has been approved successfully.`);
  };

  const handleRevokeDoc = (email, name) => {
    revokeDoctor(email);
    reloadData();
    showToast(`Access paused for ${name || 'Doctor'}.`);
  };

  const handleConfirmRequest = (req) => {
    const datetime = appointmentDates[req.id] || new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    const room = assignedRooms[req.id] || 'Room 304';
    const notes = messages[req.id] || 'Please come 10 minutes early. You can upload photos of your skin condition in your patient account.';

    const res = confirmAppointment(req.id, {
      datetime,
      room,
      notes,
      doctorName: req.doctorName,
      adminEmail: 'waheeddeveloper@gmail.com'
    });

    if (res?.email) {
      setSentEmailModal(res.email);
    }
    showToast(`✓ Appointment confirmed for ${req.patientName}! Email sent.`);
    reloadData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between animate-in fade-in text-sm font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner - Plain English */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-gradient-to-r from-slate-900 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-blue-900/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-2xl shadow-inner">
            <Building2 className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Hospital Admin Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-slate-300 text-xs md:text-sm mt-1">
              Welcome, Admin. Here you can approve patient appointments, verify payments, and manage your hospital doctors and staff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={reloadData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2 border border-slate-700 cursor-pointer"
            title="Refresh the page data"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage All Users</span>
          </Link>
        </div>
      </div>

      {/* Easy Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-blue-600 bg-white shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Patients</p>
            <Users className="text-[#306CE9] w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{metrics?.totalPatients || '4,821'}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Registered in hospital</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-indigo-600 bg-white shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Scans Done</p>
            <Activity className="text-indigo-600 w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{metrics?.totalDiagnosesRun || '12,403'}</p>
          <p className="text-xs text-indigo-600 font-semibold mt-1">Skin image scans</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500 bg-white shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Waiting for Approval</p>
            <CalendarClock className="text-amber-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{requests.length}</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">Needs your confirmation</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500 bg-white shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Hospital Rooms</p>
            <Bed className="text-emerald-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{metrics?.bedOccupancy || '78%'}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Currently in use</p>
        </div>
      </div>

      {/* SECTION 1: APPOINTMENTS & PAYMENTS WAITING FOR YOU (TOP PRIORITY) */}
      <div className="glass-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-800">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">New Appointment Requests & Payments</h2>
              <p className="text-xs text-gray-500">Patients who paid online. Check their payment, choose appointment time & room, and click approve to send them an email.</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
            {requests.length} Waiting
          </span>
        </div>
        
        <div className="p-6">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="font-bold text-gray-900 text-base">All Caught Up!</h3>
              <p className="text-gray-500 text-xs mt-1">There are no pending appointments waiting for your approval right now.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((req) => (
                <div key={req.id} className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-blue-300 transition-all flex flex-col lg:flex-row gap-6 shadow-xs">
                  
                  {/* Left: Patient & Payment Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-extrabold text-lg">{req.patientName}</span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Payment Received
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p><strong className="text-gray-900">Patient Email:</strong> {req.patientEmail}</p>
                      <p><strong className="text-gray-900">Selected Doctor:</strong> {req.doctorName}</p>
                      <p><strong className="text-gray-900">Skin Area:</strong> {req.lesionLocation || 'Body'}</p>
                      <p><strong className="text-gray-900">Problem / Reason:</strong> {req.reason || 'Skin examination'}</p>
                    </div>

                    {/* Payment Verification Box */}
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-700" />
                          <span>Amount Paid: {req.amount || '₹500.00'}</span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          UTR Transaction ID: <strong className="font-mono">{req.utrNumber || 'UTR-PAID'}</strong> (PhonePe / UPI)
                        </p>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-md">
                        ✓ PAID
                      </span>
                    </div>
                  </div>

                  {/* Middle: Admin Inputs */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        1. Pick Date & Time for Appointment
                      </label>
                      <input 
                        type="datetime-local" 
                        value={appointmentDates[req.id] || ''}
                        onChange={(e) => setAppointmentDates(prev => ({...prev, [req.id]: e.target.value}))}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        2. Assign Room / Clinic
                      </label>
                      <input 
                        type="text"
                        value={assignedRooms[req.id] || ''}
                        onChange={(e) => setAssignedRooms(prev => ({...prev, [req.id]: e.target.value}))}
                        placeholder="e.g. Room 304 (Dermatology Clinic)"
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        3. Message for Patient (Included in Email)
                      </label>
                      <input 
                        type="text"
                        value={messages[req.id] || ''}
                        onChange={(e) => setMessages(prev => ({...prev, [req.id]: e.target.value}))}
                        placeholder="Please arrive 10 minutes early. Bring previous medical papers."
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Right: Big Approve Button */}
                  <div className="flex lg:flex-col justify-center items-center gap-2 border-t lg:border-t-0 lg:border-l border-gray-200 pt-4 lg:pt-0 lg:pl-6">
                    <button 
                      onClick={() => handleConfirmRequest(req)}
                      className="w-full lg:w-48 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 text-center"
                      title="Confirm this appointment and send an email to the patient"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Send Email</span>
                    </button>
                    <p className="text-[11px] text-gray-400 text-center">
                      Sends confirmation email directly to the patient
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: DOCTORS LIST & APPROVALS */}
      <div className="glass-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hospital Doctors</h2>
              <p className="text-xs text-gray-500">View doctors, check their assigned rooms, and approve or pause their accounts.</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-mono">
            {doctors.filter(d => d.status === 'APPROVED').length} Active Doctors
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      doc.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {doc.status === 'APPROVED' ? 'Active' : doc.status === 'PENDING' ? 'Waiting for Approval' : 'Paused'}
                    </span>
                    <span className="text-xs text-gray-400">{doc.npi || 'License Verified'}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">{doc.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">{doc.specialty}</p>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Room: {doc.hospitalRoom || 'Room 304'}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{doc.email}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  {doc.status === 'PENDING' ? (
                    <button 
                      onClick={() => handleApproveDoc(doc.email, doc.name)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Approve Doctor
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRevokeDoc(doc.email, doc.name)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                    >
                      Pause Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT PATIENT SCANS */}
      <div className="glass-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-700">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Patient Skin Scans</h2>
              <p className="text-xs text-gray-500">Live list of skin images scanned by patients and assigned to doctors.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {diagnoses.length} Scans Completed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <th className="px-6 py-3 font-semibold">Scan ID</th>
                <th className="px-6 py-3 font-semibold">Patient Name</th>
                <th className="px-6 py-3 font-semibold">Body Part</th>
                <th className="px-6 py-3 font-semibold">Diagnosis Found</th>
                <th className="px-6 py-3 font-semibold">Risk Level</th>
                <th className="px-6 py-3 font-semibold">Assigned Doctor</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {diagnoses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">No scans done yet.</td>
                </tr>
              ) : (
                diagnoses.map((dx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{dx.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{dx.patientName}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {dx.bodyPart || 'Head'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{dx.condition}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        {dx.severity || 'Needs Review'}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Email Preview Modal */}
      {sentEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-gray-200 animate-in fade-in duration-200">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Confirmation Email Sent!</h3>
                  <p className="text-xs text-gray-500">The patient has been notified of their appointment date.</p>
                </div>
              </div>
              <button 
                onClick={() => setSentEmailModal(null)} 
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-gray-500 font-medium">To:</span>
                <span className="font-bold text-blue-700">{sentEmailModal.to}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-gray-500 font-medium">Subject:</span>
                <span className="font-semibold text-gray-800">{sentEmailModal.subject}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1 font-medium">Email Content:</span>
                <div className="p-3 bg-white rounded-xl border border-gray-200 text-gray-700 whitespace-pre-line leading-relaxed text-xs">
                  {sentEmailModal.body}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(sentEmailModal.to)}&su=${encodeURIComponent(sentEmailModal.subject)}&body=${encodeURIComponent(sentEmailModal.body)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Gmail Compose</span>
              </a>
              <button
                type="button"
                onClick={() => setSentEmailModal(null)}
                className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
