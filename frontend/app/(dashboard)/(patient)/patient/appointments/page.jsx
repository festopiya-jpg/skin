'use client';

import { useState, useEffect } from 'react';
import { CalendarClock, CheckCircle2, Clock } from 'lucide-react';

export default function AppointmentsPage() {
  const [requests, setRequests] = useState([]);
  const [scheduled, setScheduled] = useState([]);

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem('appointment_requests') || '[]'));
    setScheduled(JSON.parse(localStorage.getItem('scheduled_appointments') || '[]'));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 mt-1">Manage your upcoming and pending hospital consultations.</p>
      </div>

      <div className="space-y-8">
        
        {/* Scheduled Appointments */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600 w-5 h-5" />
            Confirmed Appointments
          </h2>
          {scheduled.length === 0 ? (
            <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl text-center">
              <p className="text-gray-500">No confirmed appointments at this time.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {scheduled.map((apt, idx) => (
                <div key={idx} className="bg-white border border-gray-100 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-100 relative">
                    <img 
                      src={`/doctors/doc${(idx % 2) + 1}.jpg`} 
                      alt={apt.doctorName} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-gray-900 font-bold text-lg">{apt.doctorName}</h3>
                          <p className="text-[#306CE9] font-medium text-sm">Dermatologist</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                          CONFIRMED
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 my-4">
                        <p className="text-gray-900 font-bold flex items-center gap-2">
                          <CalendarClock className="w-4 h-4 text-[#306CE9]" />
                          {new Date(apt.datetime).toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                          <span className="font-semibold text-gray-800">Admin Note:</span> {apt.message}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Please head to your Dashboard at the scheduled time to upload your images.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Requests */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="text-amber-500 w-5 h-5" />
            Pending Requests
          </h2>
          {requests.length === 0 ? (
            <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl text-center">
              <p className="text-gray-500">No pending appointment requests.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((req, idx) => (
                <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex justify-between items-center opacity-80">
                  <div className="flex items-center gap-4">
                    <img src={`/doctors/doc${(idx % 2) + 1}.jpg`} alt={req.doctorName} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                    <div>
                      <h3 className="text-gray-900 font-bold">{req.doctorName}</h3>
                      <p className="text-gray-500 text-sm">Requested Consultation</p>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    WAITING ADMIN
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
