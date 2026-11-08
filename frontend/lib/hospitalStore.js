// Hospital Central Data Store & Real-time Collaboration Engine
// Manages end-to-end synchronization between Patient, Doctor, Admin, Pharmacy, and Lab modules.

const DEFAULT_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sarah Mercer, MD',
    email: 'sarah.mercer@dermxai.org',
    specialty: 'Cutaneous Oncology & Melanoma Specialist',
    npi: 'NPI-1849204921',
    status: 'APPROVED',
    phone: '+1 (555) 234-8901',
    hospitalRoom: 'Consultation Suite 304',
    rating: 4.9,
    reviewsCount: 142,
    avatar: '/doctors/doc1.jpg'
  },
  {
    id: 2,
    name: 'Dr. Alexander Hayes, MD',
    email: 'alex.hayes@dermxai.org',
    specialty: 'Dermatopathology & Surgical Excision',
    npi: 'NPI-1928471029',
    status: 'APPROVED',
    phone: '+1 (555) 345-6712',
    hospitalRoom: 'Surgical Clinic 108',
    rating: 4.8,
    reviewsCount: 98,
    avatar: '/doctors/doc2.jpg'
  },
  {
    id: 3,
    name: 'Dr. Priya Patel, MD',
    email: 'priya.patel@dermxai.org',
    specialty: 'Pediatric & General Dermatology',
    npi: 'NPI-1492019482',
    status: 'APPROVED',
    phone: '+1 (555) 456-7890',
    hospitalRoom: 'Pediatric Ward 210',
    rating: 5.0,
    reviewsCount: 115,
    avatar: '/doctors/doc1.jpg'
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 'APT-101',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    patientPhone: '+1 (555) 912-3841',
    doctorName: 'Dr. Sarah Mercer, MD',
    doctorEmail: 'sarah.mercer@dermxai.org',
    datetime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    status: 'Confirmed',
    room: 'Consultation Suite 304',
    lesionLocation: 'Head',
    reason: 'Rapidly evolving pigmented border lesion on left temporal region',
    adminNotes: 'Assigned priority specialist evaluation. Dermoscopy pre-scan attached.'
  },
  {
    id: 'APT-102',
    patientName: 'Marcus Bennett',
    patientEmail: 'marcus.b@example.com',
    patientPhone: '+1 (555) 829-1029',
    doctorName: 'Dr. Alexander Hayes, MD',
    doctorEmail: 'alex.hayes@dermxai.org',
    datetime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    status: 'Confirmed',
    room: 'Surgical Clinic 108',
    lesionLocation: 'Torso',
    reason: 'Dysplastic junctional nevus follow-up examination',
    adminNotes: 'Pre-op evaluation room prepared.'
  }
];

const DEFAULT_DIAGNOSES = [
  {
    id: 'DX-8921',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    bodyPart: 'Head',
    condition: 'Atypical Melanocytic Proliferation',
    severity: 'Urgent Specialist Examination',
    confidence: 94.8,
    riskScore: 8.9,
    timestamp: new Date().toLocaleString('en-US'),
    status: 'Pending Doctor Review',
    assignedDoctorName: 'Dr. Sarah Mercer, MD',
    snomedCode: '91861009 (Melanoma of skin)',
    abcde: {
      a: 'Marked asymmetry across primary vertical axis',
      b: 'Irregular border scalloping with pigment fading',
      c: 'Heterogeneous three-tone pigmentation',
      d: '7.2 mm diameter (above 6mm threshold)',
      e: 'Patient noted surface elevation over past 6 weeks'
    }
  }
];

const DEFAULT_PRESCRIPTIONS = [
  {
    id: 'RX-501',
    patientName: 'Marcus Bennett',
    doctorName: 'Dr. Alexander Hayes, MD',
    date: new Date().toLocaleDateString(),
    medications: [
      { name: 'Imiquimod 5% Topical Cream', dosage: 'Apply once nightly 3x/week', quantity: '1 box (12 packets)' },
      { name: 'Mupirocin 2% Ointment', dosage: 'Twice daily after cleaning area', quantity: '22g tube' }
    ],
    status: 'Dispensed',
    pharmacyNotes: 'Dispensed by Clinical Pharmacy Team. Patient counseled on local skin reactions.'
  }
];

const DEFAULT_LAB_ORDERS = [
  {
    id: 'LAB-901',
    patientName: 'Eleanor Vance',
    doctorName: 'Dr. Sarah Mercer, MD',
    date: new Date().toLocaleDateString(),
    testType: 'Punch Biopsy Histopathology & Fontana-Masson Stain',
    anatomicalSite: 'Left Temporal Scalp',
    status: 'Processing',
    priority: 'STAT (Urgent)',
    findings: 'Specimen received in 10% neutral buffered formalin. Microscopic evaluation in progress.'
  }
];

// Helper to safely get and parse localStorage
function getStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

// Helper to safely save to localStorage
function setStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Initialize default store if not present
export function initHospitalStore() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('system_doctors')) {
    setStorage('system_doctors', DEFAULT_DOCTORS);
  }
  if (!localStorage.getItem('scheduled_appointments')) {
    setStorage('scheduled_appointments', DEFAULT_APPOINTMENTS);
  }
  if (!localStorage.getItem('pending_diagnoses')) {
    setStorage('pending_diagnoses', DEFAULT_DIAGNOSES);
  }
  if (!localStorage.getItem('pending_medical')) {
    setStorage('pending_medical', DEFAULT_PRESCRIPTIONS);
  }
  if (!localStorage.getItem('pending_lab')) {
    setStorage('pending_lab', DEFAULT_LAB_ORDERS);
  }
}

// DOCTOR APIS
export function getDoctors() {
  initHospitalStore();
  return getStorage('system_doctors', DEFAULT_DOCTORS);
}

export function approveDoctor(email) {
  const doctors = getDoctors();
  const updated = doctors.map(d => d.email === email ? { ...d, status: 'APPROVED' } : d);
  setStorage('system_doctors', updated);
  return updated;
}

export function revokeDoctor(email) {
  const doctors = getDoctors();
  const updated = doctors.map(d => d.email === email ? { ...d, status: 'REVOKED' } : d);
  setStorage('system_doctors', updated);
  return updated;
}

export function addDoctor(doctor) {
  const doctors = getDoctors();
  if (doctors.some(d => d.email === doctor.email)) return doctors;
  const newDoctor = {
    id: Date.now(),
    status: 'PENDING',
    rating: 5.0,
    reviewsCount: 0,
    avatar: '/doctors/doc1.jpg',
    ...doctor
  };
  const updated = [...doctors, newDoctor];
  setStorage('system_doctors', updated);
  return updated;
}

// APPOINTMENT APIS
export function getAppointments() {
  initHospitalStore();
  const scheduled = getStorage('scheduled_appointments', DEFAULT_APPOINTMENTS);
  const requests = getStorage('appointment_requests', []);
  return { scheduled, requests };
}

export function createAppointmentRequest(data) {
  initHospitalStore();
  const requests = getStorage('appointment_requests', []);
  const newReq = {
    id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Needs Scheduling',
    createdAt: new Date().toISOString(),
    ...data
  };
  const updated = [newReq, ...requests];
  setStorage('appointment_requests', updated);
  return newReq;
}

export function confirmAppointment(requestId, { datetime, room, notes, doctorName }) {
  initHospitalStore();
  const requests = getStorage('appointment_requests', []);
  const scheduled = getStorage('scheduled_appointments', DEFAULT_APPOINTMENTS);

  const target = requests.find(r => r.id === requestId);
  const updatedRequests = requests.filter(r => r.id !== requestId);
  setStorage('appointment_requests', updatedRequests);

  const confirmedItem = {
    id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
    patientName: target?.patientName || 'Patient',
    patientEmail: target?.patientEmail || 'patient@dermxai.org',
    doctorName: doctorName || target?.doctorName || 'Dr. Sarah Mercer, MD',
    datetime: datetime || new Date().toISOString(),
    room: room || 'Consultation Suite 304',
    status: 'Confirmed',
    lesionLocation: target?.lesionLocation || 'Torso',
    reason: target?.reason || 'Clinical Consultation',
    adminNotes: notes || 'Confirmed by Central Hospital Administration.'
  };

  const updatedScheduled = [confirmedItem, ...scheduled];
  setStorage('scheduled_appointments', updatedScheduled);
  return { updatedRequests, updatedScheduled };
}

// DIAGNOSIS & EHR APIS
export function getDiagnoses() {
  initHospitalStore();
  return getStorage('pending_diagnoses', DEFAULT_DIAGNOSES);
}

export function recordPatientDiagnosis(diagnosis) {
  initHospitalStore();
  const existing = getStorage('pending_diagnoses', DEFAULT_DIAGNOSES);
  const newEntry = {
    id: `DX-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: new Date().toLocaleString('en-US'),
    status: 'Pending Doctor Review',
    ...diagnosis
  };
  const updated = [newEntry, ...existing];
  setStorage('pending_diagnoses', updated);
  return newEntry;
}

export function resolveDoctorDiagnosis(diagnosisId, doctorNotes, returnCode) {
  initHospitalStore();
  const diagnoses = getStorage('pending_diagnoses', DEFAULT_DIAGNOSES);
  const updated = diagnoses.map(d => d.id === diagnosisId ? {
    ...d,
    status: 'Doctor Sign-Off Complete',
    doctorNotes,
    returnCode
  } : d);
  setStorage('pending_diagnoses', updated);
  return updated;
}

// PHARMACY & LAB ORDERS
export function createPrescriptionOrder(order) {
  initHospitalStore();
  const existing = getStorage('pending_medical', DEFAULT_PRESCRIPTIONS);
  const newOrder = {
    id: `RX-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString(),
    status: 'Pending Dispensation',
    ...order
  };
  const updated = [newOrder, ...existing];
  setStorage('pending_medical', updated);
  return newOrder;
}

export function createLabOrder(order) {
  initHospitalStore();
  const existing = getStorage('pending_lab', DEFAULT_LAB_ORDERS);
  const newOrder = {
    id: `LAB-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString(),
    status: 'Specimen Queued',
    ...order
  };
  const updated = [newOrder, ...existing];
  setStorage('pending_lab', updated);
  return newOrder;
}

// SYSTEM METRICS & KPI
export function getHospitalMetrics() {
  initHospitalStore();
  const doctors = getStorage('system_doctors', DEFAULT_DOCTORS);
  const scheduled = getStorage('scheduled_appointments', DEFAULT_APPOINTMENTS);
  const requests = getStorage('appointment_requests', []);
  const diagnoses = getStorage('pending_diagnoses', DEFAULT_DIAGNOSES);
  const prescriptions = getStorage('pending_medical', DEFAULT_PRESCRIPTIONS);
  const labOrders = getStorage('pending_lab', DEFAULT_LAB_ORDERS);

  return {
    totalPatients: 4821 + diagnoses.length,
    activeDoctors: doctors.filter(d => d.status === 'APPROVED').length,
    pendingDoctorApprovals: doctors.filter(d => d.status === 'PENDING').length,
    totalAppointments: scheduled.length + requests.length,
    pendingAppointments: requests.length,
    confirmedAppointments: scheduled.length,
    totalDiagnosesRun: 12403 + diagnoses.length,
    pendingReviews: diagnoses.filter(d => d.status === 'Pending Doctor Review').length,
    prescriptionsCount: prescriptions.length,
    labOrdersCount: labOrders.length,
    serverUptime: '99.98% (Multi-Region Cloud)',
    bedOccupancy: '78%'
  };
}
