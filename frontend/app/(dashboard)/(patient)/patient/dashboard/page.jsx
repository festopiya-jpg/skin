'use client';

import { useState, useEffect } from 'react';
import BodySelector from '@/components/BodySelector';
import { UploadCloud, ShieldAlert, FileText, CheckCircle2, UserCircle2, Clock, CalendarClock } from 'lucide-react';

export default function PatientDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState('Unknown');
  
  // New State variables for Appointment Workflow
  const [systemDoctors, setSystemDoctors] = useState([]);
  const [workflowState, setWorkflowState] = useState('SELECT_DOCTOR'); // SELECT_DOCTOR, WAITING_ADMIN, APPOINTMENT_SET
  const [scheduledAppointment, setScheduledAppointment] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);

  useEffect(() => {
    // 1. Load System Doctors
    const docs = JSON.parse(localStorage.getItem('system_doctors') || '[]');
    setSystemDoctors(docs);

    // 2. Determine Patient State
    const myScheduled = JSON.parse(localStorage.getItem('scheduled_appointments') || '[]');
    const myRequests = JSON.parse(localStorage.getItem('appointment_requests') || '[]');
    const myRecords = JSON.parse(localStorage.getItem('patient_records') || '[]');
    
    setPatientRecords(myRecords);

    // Simplistic check for demo: if there is a scheduled appointment, show it.
    if (myScheduled.length > 0) {
      setScheduledAppointment(myScheduled[0]);
      setWorkflowState('APPOINTMENT_SET');
    } else if (myRequests.length > 0) {
      setWorkflowState('WAITING_ADMIN');
    } else {
      setWorkflowState('SELECT_DOCTOR');
    }
  }, []);

  const handleSelectDoctor = (doctor) => {
    const request = {
      id: Date.now(),
      patientName: 'Current Patient', // In real app, fetch from auth
      doctorId: doctor.id,
      doctorName: doctor.name,
      status: 'Pending Admin Approval'
    };
    const reqs = JSON.parse(localStorage.getItem('appointment_requests') || '[]');
    localStorage.setItem('appointment_requests', JSON.stringify([request, ...reqs]));
    setWorkflowState('WAITING_ADMIN');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // reset
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setResult(data);

      // Route data to doctor
      const diagnosisRecord = {
        id: Date.now(),
        name: 'Current Patient',
        condition: data.disease,
        severity: data.severity,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending Review',
        bodyPart: selectedBodyPart,
        research: data.detailed_research,
        assignedDoctorId: scheduledAppointment?.doctorId,
        assignedDoctorName: scheduledAppointment?.doctorName
      };
      
      const existing = JSON.parse(localStorage.getItem('pending_diagnoses') || '[]');
      localStorage.setItem('pending_diagnoses', JSON.stringify([diagnosisRecord, ...existing]));
      
      // Clear scheduled appointment now that upload is complete
      localStorage.setItem('scheduled_appointments', JSON.stringify([]));

    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Make sure the FastAPI backend is running on port 8000.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="text-slate-400 mt-1">Upload a skin image for AI analysis or view your 3D health map.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: AI Tool / Workflow */}
        <div className="flex flex-col gap-6">
          
          {/* Appointment Workflow UI */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CalendarClock className="text-indigo-400 w-5 h-5" />
              Consultation Status
            </h2>
            
            {workflowState === 'SELECT_DOCTOR' && (
              <div className="space-y-4">
                <p className="text-slate-300">Select an available dermatologist to request a consultation:</p>
                {systemDoctors.length === 0 ? (
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                    <p className="text-slate-400 text-sm">No doctors currently registered in the system.</p>
                    <p className="text-slate-500 text-xs mt-1">Register a doctor account first to see them here.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {systemDoctors.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <UserCircle2 className="text-slate-400 w-8 h-8" />
                          <div>
                            <p className="text-white font-bold">{doc.name}</p>
                            <p className="text-slate-400 text-xs">{doc.email}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSelectDoctor(doc)}
                          className="bg-sky-500 hover:bg-sky-400 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Select Doctor
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {workflowState === 'WAITING_ADMIN' && (
              <div className="text-center py-6 space-y-4">
                <Clock className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-white">Request Sent to Admin</h3>
                  <p className="text-slate-400 text-sm mt-1">Waiting for the hospital admin to assign you a consultation date and time.</p>
                </div>
              </div>
            )}

            {workflowState === 'APPOINTMENT_SET' && scheduledAppointment && (
              <div className="bg-emerald-900/20 border border-emerald-500/30 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-emerald-400 font-bold">Appointment Confirmed!</h3>
                    <p className="text-slate-300 text-sm mt-1">Doctor: {scheduledAppointment.doctorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{new Date(scheduledAppointment.datetime).toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-500/20">
                  <p className="text-sm text-emerald-200">
                    <span className="font-bold">Admin Message: </span>
                    {scheduledAppointment.message}
                  </p>
                </div>
                <p className="text-xs text-slate-400 pt-2">
                  The AI Diagnostic tool is now unlocked. Please upload your lesion image below.
                </p>
              </div>
            )}
          </div>

          {/* XAI Analysis Tool */}
          <div className="glass-card rounded-2xl p-6 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-sky-400 w-5 h-5" />
                AI Diagnostic Tool
              </h2>
              {workflowState !== 'APPOINTMENT_SET' && !result && (
                <span className="text-xs font-bold px-2 py-1 bg-rose-500/20 text-rose-400 rounded-md">LOCKED</span>
              )}
            </div>
            
            {workflowState !== 'APPOINTMENT_SET' && !result ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50 p-8 text-center opacity-50">
                <UploadCloud className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-500 font-medium mb-1">Upload Locked</p>
                <p className="text-xs text-slate-600">You must have a scheduled appointment to upload images.</p>
              </div>
            ) : !previewUrl && !result ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 rounded-xl bg-emerald-900/10 p-8 text-center hover:bg-emerald-900/20 transition-all">
                <UploadCloud className="w-12 h-12 text-emerald-400 mb-3" />
                <p className="text-white font-medium mb-1">Upload Lesion Image</p>
                <p className="text-sm text-slate-400 mb-4">PNG, JPG up to 10MB</p>
                <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors font-medium shadow-lg shadow-emerald-500/20">
                  Browse Files
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            ) : !result ? (
              <div className="flex flex-col gap-4 flex-1">
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black/50 border border-slate-700">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="flex-1 py-2 px-4 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 py-2 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis & Send'}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Results Area */}
            {result && (
              <div className="p-5 rounded-xl border border-sky-500/30 bg-sky-500/10 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Analysis Sent to Doctor!
                    </h3>
                    <p className="text-sky-300 font-medium">Predicted: {result.disease}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">{result.explanation}</p>
                
                <div className="border-t border-slate-700/50 pt-3">
                  <img src={`data:image/jpeg;base64,${result.heatmap_base64}`} alt="Heatmap" className="w-full rounded-lg border border-slate-700" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 3D Body & Records */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-4">3D Health Map</h2>
            <BodySelector onSelect={(data) => setSelectedBodyPart(data.partName)} />
          </div>
          
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Past Visits & Return Codes
            </h2>
            <div className="space-y-3">
              {patientRecords.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No past visits recorded.</p>
              ) : (
                patientRecords.map((record, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div>
                      <p className="text-sm font-bold text-white">{record.condition}</p>
                      <p className="text-xs text-slate-400">Dr. {record.doctorName} • {record.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Return Code</p>
                      <span className="bg-indigo-500/20 text-indigo-300 font-mono text-sm px-3 py-1 rounded-md border border-indigo-500/30">
                        {record.returnCode}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}