'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarClock, CheckCircle2, Clock, Plus, QrCode, 
  CreditCard, ShieldCheck, Mail, ArrowRight, UploadCloud, 
  Copy, Check, AlertCircle, Sparkles, X, Stethoscope, MapPin, Camera 
} from 'lucide-react';
import { 
  getAppointments, 
  createAppointmentRequest, 
  getDoctors, 
  getPaymentConfig 
} from '@/lib/hospitalStore';

export default function AppointmentsPage() {
  const [requests, setRequests] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [patientUser, setPatientUser] = useState({ name: 'Patient', email: 'patient@example.com' });

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1 = Details, 2 = QR Pay
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [lesionLocation, setLesionLocation] = useState('Face & Neck');
  const [symptoms, setSymptoms] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  
  // Payment Proof State
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [customQrLink, setCustomQrLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const loadData = () => {
    const session = JSON.parse(localStorage.getItem('session_user') || '{}');
    if (session.name) {
      setPatientUser({ name: session.name, email: session.email });
    }

    const { scheduled: sched, requests: reqs } = getAppointments();
    setScheduled(sched);
    setRequests(reqs);

    const docList = getDoctors().filter(d => d.status === 'APPROVED');
    setDoctors(docList);
    if (docList.length > 0 && !selectedDoctor) {
      setSelectedDoctor(docList[0].name);
    }

    const payCfg = getPaymentConfig();
    setPaymentConfig(payCfg);
    setCustomQrLink(payCfg.paymentLink);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyPaymentLink = () => {
    const link = customQrLink || paymentConfig?.paymentLink || 'upi://pay?pa=waheeddeveloper@okhdfcbank';
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setBookingStep(2);
  };

  const handleSubmitBookingWithPayment = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanUtr = utrNumber.trim() || `UTR-${Date.now().toString()}`;

    createAppointmentRequest({
      patientName: patientUser.name,
      patientEmail: patientUser.email,
      doctorName: selectedDoctor,
      lesionLocation,
      reason: symptoms || 'Dermatological screening & consultation',
      preferredDate: preferredDate || new Date().toISOString(),
      amount: '₹500.00',
      utrNumber: cleanUtr,
      paymentMethod: 'UPI QR Pay',
      paymentStatus: 'PAID_PENDING_ADMIN_VERIFICATION',
      status: 'Payment Pending Admin Approval'
    });

    setIsSubmitting(false);
    setBookingSuccess(true);
    loadData();
  };

  // Generate dynamic QR Code URL from payment link
  const currentQrLink = customQrLink || paymentConfig?.paymentLink || 'upi://pay?pa=waheeddeveloper@okhdfcbank&pn=DermXAI%20Hospital&am=500&cu=INR';
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(currentQrLink)}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header with Book Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#D4A034] block">
            CLINICAL OUTPATIENT SERVICES
          </span>
          <h1 className="font-serif-hospital text-3xl sm:text-4xl text-[#0F4C81] font-normal tracking-tight">
            Hospital Appointments & Consultations
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Schedule specialist doctor visits, pay consultation fees via PhonePe UPI QR, and receive scheduled times verified by Administration.
          </p>
        </div>
        <button
          onClick={() => {
            setShowBookingModal(true);
            setBookingStep(1);
          }}
          className="bg-[#D4A034] hover:bg-[#c39129] text-slate-950 font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Book an Appointment</span>
        </button>
      </div>

      {/* Confirmed Appointments Section */}
      <div>
        <h2 className="font-serif-hospital text-2xl text-[#0F4C81] font-normal mb-3 flex items-center gap-2">
          <CheckCircle2 className="text-emerald-600 w-5 h-5" />
          <span>Confirmed Consultations</span>
        </h2>
        {scheduled.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-xs p-8 rounded-2xl text-center">
            <p className="text-gray-500 text-sm">No confirmed appointments at this time.</p>
            <p className="text-xs text-gray-400 mt-1">Book an appointment above and complete QR payment to receive confirmation.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {scheduled.map((apt, idx) => (
              <div key={idx} className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-52 h-44 md:h-auto bg-slate-100 relative">
                  <img 
                    src={`/doctors/doc${(idx % 2) + 1}.jpg`} 
                    alt={apt.doctorName} 
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>PAID & CONFIRMED</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-serif-hospital text-xl text-gray-900 font-normal">{apt.doctorName}</h3>
                        <p className="text-[#306CE9] font-semibold text-xs">Attending Specialist • Cutaneous Clinic</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Consultation Date & Time</span>
                        <p className="text-gray-900 font-bold text-xs mt-0.5 flex items-center gap-1.5">
                          <CalendarClock className="w-3.5 h-3.5 text-[#306CE9]" />
                          <span>{new Date(apt.datetime).toLocaleString()}</span>
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-gray-500 block">Location / Suite</span>
                        <p className="text-gray-900 font-bold text-xs mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>{apt.room || 'Consultation Suite 304'}</span>
                        </p>
                      </div>
                    </div>

                    {apt.adminNotes && (
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                        <strong>Admin Instructions:</strong> {apt.adminNotes}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Official email confirmation dispatched from <strong>Hospital Administration</strong></span>
                    </p>
                    <Link
                      href="/patient/dashboard"
                      className="text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1"
                    >
                      <span>Upload Disease Photos for Doctor</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests & Payment Verification */}
      <div>
        <h2 className="font-serif-hospital text-2xl text-[#0F4C81] font-normal mb-3 flex items-center gap-2">
          <Clock className="text-amber-500 w-5 h-5" />
          <span>Pending Requests Awaiting Admin Schedule</span>
        </h2>
        {requests.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-xs p-6 rounded-2xl text-center">
            <p className="text-gray-500 text-xs">No pending requests awaiting scheduling.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {requests.map((req, idx) => (
              <div key={idx} className="bg-white border border-amber-200 shadow-xs rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold shrink-0">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-900 font-bold text-sm">{req.doctorName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {req.amount || '₹500.00'} PAID
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-0.5">
                      Lesion: <span className="font-semibold">{req.lesionLocation || 'General'}</span> • {req.reason}
                    </p>
                    <p className="text-[11px] font-mono text-gray-400 mt-1">
                      UTR Reference: <strong className="text-gray-700">{req.utrNumber || 'PENDING'}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[11px] font-bold inline-block animate-pulse">
                    WAITING ADMIN APPROVAL
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Hospital Administration will verify payment & email appointment time.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Appointment Booking & QR Payment Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-gray-200 animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0F4C81] text-white flex items-center justify-center shadow-xs">
                  {bookingStep === 1 ? <Stethoscope className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-serif-hospital text-lg font-normal text-gray-900">
                    {bookingStep === 1 ? 'Step 1: Select Doctor & Clinical Details' : 'Step 2: Scan PhonePe QR to Pay Consultation Fee'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {bookingStep === 1 ? 'Choose attending physician and anatomical location' : 'Payee: ABDUL WAHEED • Fee ₹500 • Admin will confirm schedule date via Gmail'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="font-serif-hospital text-2xl font-normal text-gray-900">Appointment Request & Payment Submitted!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Your fee payment of <strong>₹500.00</strong> (UTR: <strong>{utrNumber}</strong>) has been submitted to Hospital Admin. You will receive an official email confirmation from <strong>Hospital Administration</strong>.
                </p>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 font-medium leading-relaxed">
                  Next Step: Upload photos of your skin condition now to run the AI scan and view the exact clinical results transmitted to your doctor!
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href="/patient/dashboard"
                    className="px-5 py-2.5 bg-[#0F4C81] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-emerald-300" />
                    <span>Upload Disease Photos & View AI Scan Results →</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSuccess(false);
                      setShowBookingModal(false);
                      setBookingStep(1);
                      setSymptoms('');
                      setUtrNumber('');
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : bookingStep === 1 ? (
              /* STEP 1: FORM */
              <form onSubmit={handleProceedToPayment} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Select Specialist Physician</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C81] focus:outline-none"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} — {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Anatomical Location</label>
                    <select
                      value={lesionLocation}
                      onChange={(e) => setLesionLocation(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C81] focus:outline-none"
                    >
                      <option value="Face & Neck">Face & Neck</option>
                      <option value="Scalp & Head">Scalp & Head</option>
                      <option value="Chest & Torso">Chest & Torso</option>
                      <option value="Upper Back & Spine">Upper Back & Spine</option>
                      <option value="Arms & Hands">Arms & Hands</option>
                      <option value="Legs & Feet">Legs & Feet</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C81] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Describe Symptoms or Condition</label>
                  <textarea
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="E.g., Pigmented expanding mole, itchy red rash, dry flaking patches for 3 weeks..."
                    rows={3}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs focus:ring-2 focus:ring-[#0F4C81] focus:outline-none resize-none"
                  />
                </div>

                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-blue-900 block">Outpatient Consultation Fee</span>
                    <span className="text-[11px] text-blue-700">Payable via PhonePe UPI QR in next step</span>
                  </div>
                  <span className="text-lg font-black text-[#0F4C81]">₹500.00</span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0F4C81] hover:bg-blue-900 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Proceed to PhonePe Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 2: AUTHENTIC PHONEPE QR PAYMENT */
              <form onSubmit={handleSubmitBookingWithPayment} className="space-y-4 pt-3 text-xs">
                
                {/* Authentic PhonePe Card Container */}
                <div className="flex flex-col items-center p-3 sm:p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white shadow-inner">
                  <span className="text-[10px] font-bold text-[#D4A034] uppercase tracking-widest mb-2 font-mono">
                    PHONEPE SECURE SCAN & PAY
                  </span>
                  
                  {/* PhonePe Card Image */}
                  <div className="relative max-w-[240px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                    <img 
                      src="/payment-qr.jpg" 
                      alt="PhonePe QR - ABDUL WAHEED" 
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between w-full max-w-[240px] px-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Payee Name</span>
                      <strong className="text-white text-xs font-mono">ABDUL WAHEED</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Amount</span>
                      <strong className="text-[#D4A034] text-sm font-black">₹500.00</strong>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <p className="text-[11px] text-gray-600 text-center leading-relaxed">
                  Open <strong>PhonePe</strong>, <strong>Google Pay</strong>, or <strong>Paytm</strong> on your phone and scan the QR code above to pay <strong>₹500.00</strong> to <strong>ABDUL WAHEED</strong>.
                </p>

                {/* UTR Input */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-800 block">
                    Enter 12-Digit UPI Transaction ID / UTR Number
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g., 412891048291"
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 text-xs font-mono placeholder-gray-400 focus:ring-2 focus:ring-[#0F4C81] focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500">
                    Visible in your payment app under "Transaction Details" or "UPI Ref No." after successful payment.
                  </p>
                </div>

                {/* Notice */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Upon submitting, <strong>Hospital Administration</strong> will verify payment to <strong>ABDUL WAHEED</strong> and email your confirmed appointment date and time.
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 text-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Payment Proof & Book</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
