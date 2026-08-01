'use client';

import { useState, useEffect } from 'react';
import { Users, Settings, Activity, Server, ShieldCheck, CalendarClock, Send } from 'lucide-react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  
  // Form states per request ID
  const [appointmentDates, setAppointmentDates] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const loadedRequests = JSON.parse(localStorage.getItem('appointment_requests') || '[]');
    setRequests(loadedRequests);

    const doctors = JSON.parse(localStorage.getItem('system_doctors') || '[]');
    setPendingDoctors(doctors.filter(d => d.status === 'PENDING'));
  }, []);

  const handleApproveDoctor = (email) => {
    const doctors = JSON.parse(localStorage.getItem('system_doctors') || '[]');
    const updated = doctors.map(d => d.email === email ? { ...d, status: 'APPROVED' } : d);
    localStorage.setItem('system_doctors', JSON.stringify(updated));
    setPendingDoctors(updated.filter(d => d.status === 'PENDING'));
    alert('Doctor approved successfully. Patients can now book appointments with them.');
  };

  const handleSendAppointment = (request) => {
    const datetime = appointmentDates[request.id];
    const message = messages[request.id] || 'Please arrive 10 minutes early. Upload your image prior to the appointment.';
    
    if (!datetime) {
      alert('Please select a date and time for the appointment.');
      return;
    }

    const scheduled = {
      ...request,
      datetime,
      message,
      status: 'Scheduled'
    };

    // 1. Remove from requests
    const updatedRequests = requests.filter(r => r.id !== request.id);
    setRequests(updatedRequests);
    localStorage.setItem('appointment_requests', JSON.stringify(updatedRequests));

    // 2. Add to scheduled_appointments (for patient to see)
    const existingScheduled = JSON.parse(localStorage.getItem('scheduled_appointments') || '[]');
    localStorage.setItem('scheduled_appointments', JSON.stringify([scheduled, ...existingScheduled]));
    
    alert(`Appointment scheduled for ${request.patientName} with Dr. ${request.doctorName}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Admin Overview</h1>
          <p className="text-gray-500 mt-1">Manage users, view system health, and schedule requested appointments.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl border-t-2 border-blue-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <Users className="text-[#306CE9] w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">4,821</p>
        </div>
        <div className="glass-card p-5 rounded-xl border-t-2 border-indigo-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm font-medium">AI Predictions</p>
            <Activity className="text-indigo-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">12,403</p>
        </div>
        <div className="glass-card p-5 rounded-xl border-t-2 border-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm font-medium">Server Uptime</p>
            <Server className="text-emerald-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">99.99%</p>
        </div>
      </div>

      {/* Doctor Verification Block */}
      {pendingDoctors.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden mt-6 border border-amber-200">
          <div className="p-6 border-b border-gray-200/50 flex items-center gap-3 bg-amber-50">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ShieldCheck className="text-amber-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Pending Doctor Verifications</h2>
          </div>
          <div className="p-6 grid gap-4">
            {pendingDoctors.map((doc, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={`/doctors/doc${(idx % 2) + 1}.jpg`} alt={doc.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                  <div>
                    <h3 className="font-bold text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleApproveDoctor(doc.email)}
                  className="bg-[#306CE9] hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Approve Doctor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Management Block */}
      <div className="glass-card rounded-2xl overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200/50 flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            <CalendarClock className="text-amber-600 w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Pending Appointment Requests</h2>
        </div>
        
        <div className="p-6">
          {requests.length === 0 ? (
            <div className="text-center py-10">
              <CalendarClock className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
              <p className="text-gray-500 font-medium">No pending appointment requests.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {requests.map((req) => (
                <div key={req.id} className="bg-white/50 border border-gray-200 rounded-xl p-5 flex flex-col lg:flex-row gap-6">
                  
                  {/* Request Info */}
                  <div className="flex-1 flex gap-4">
                    <img src={`/doctors/doc${(req.id % 2) + 1}.jpg`} alt={req.doctorName} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-900 font-bold text-lg">{req.patientName}</span>
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-600 border border-amber-500/30">
                          Needs Scheduling
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Requested Doctor: <span className="text-[#306CE9] font-medium">{req.doctorName}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Request ID: {req.id}</p>
                    </div>
                  </div>

                  {/* Scheduling Form */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Assign Date & Time</label>
                      <input 
                        type="datetime-local" 
                        value={appointmentDates[req.id] || ''}
                        onChange={(e) => setAppointmentDates(prev => ({...prev, [req.id]: e.target.value}))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Custom Message</label>
                      <textarea 
                        value={messages[req.id] || ''}
                        onChange={(e) => setMessages(prev => ({...prev, [req.id]: e.target.value}))}
                        placeholder="Please arrive 10 minutes early. Upload your image prior to the appointment."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 text-sm resize-none h-20"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end border-t lg:border-t-0 lg:border-l border-gray-200/50 pt-4 lg:pt-0 lg:pl-6">
                    <button 
                      onClick={() => handleSendAppointment(req)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20 w-full lg:w-auto justify-center"
                    >
                      <Send className="w-5 h-5" />
                      Send Details
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}