const { jsPDF } = require('./frontend/node_modules/jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

const pageWidth = 210;
const pageHeight = 297;
const margin = 14;
const contentWidth = pageWidth - (margin * 2);

let yPos = 14;

function checkPage(neededHeight = 15) {
  if (yPos + neededHeight > pageHeight - 15) {
    doc.addPage();
    yPos = 15;
    drawHeader();
  }
}

function drawHeader() {
  doc.setFillColor(48, 108, 233);
  doc.rect(margin, yPos, contentWidth, 1.5, 'F');
  yPos += 5;
}

// 1. Header Banner
doc.setFillColor(15, 23, 42); // slate-900
doc.roundedRect(margin, yPos, contentWidth, 24, 3, 3, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(255, 255, 255);
doc.text('DermXAI: Hospital Clinical Decision Support System', margin + 6, yPos + 8);

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(147, 197, 253);
doc.text('Official Technical Documentation • B.Tech CSE Final Year Capstone Project', margin + 6, yPos + 14);
doc.text('System Administrator: Waheed (waheeddeveloper@gmail.com) • Production Architecture', margin + 6, yPos + 19);

yPos += 30;

// 2. Executive Summary Box
doc.setFillColor(248, 250, 252);
doc.setDrawColor(226, 232, 240);
doc.roundedRect(margin, yPos, contentWidth, 22, 2, 2, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(30, 41, 59);
doc.text('Project Architectural Overview & Scope', margin + 4, yPos + 6);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(71, 85, 105);
const summaryText = 'DermXAI is an end-to-end Healthcare & Dermatopathology Decision Support System (DSS). It synchronizes patient ABCDE skin lesion evaluations with active hospital operations, featuring Role-Based Access Control (Admin, Doctor, Pharmacy, Lab, Patient), administrative approval for all registrations, client-side vector PDF generation, and automated multi-department order routing.';
const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 8);
doc.text(splitSummary, margin + 4, yPos + 11);

yPos += 28;

// 3. Section 2 Title: A to Z Guide
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(30, 58, 138); // blue-900
doc.text('Section 2: A to Z Codebase Guide (What Every File & Code Does)', margin, yPos);

yPos += 3;
doc.setDrawColor(48, 108, 233);
doc.setLineWidth(0.6);
doc.line(margin, yPos, margin + contentWidth, yPos);
yPos += 5;

// Code Files Data
const filesData = [
  {
    path: 'frontend/app/page.jsx',
    title: 'Hospital Landing Page & Portal Gateway',
    desc: 'Public entry point containing the navigation bar, emergency care cards, hospital room availability, shortcut to the 3D Anatomical Health Radar, and routing to Sign In and Sign Up.'
  },
  {
    path: 'frontend/app/layout.jsx',
    title: 'Root Application Shell & Font Provider',
    desc: 'Applies global viewport configurations, initializes GeistSans medical font family, and wraps all pages in the root Next.js 16 App Router structure.'
  },
  {
    path: 'frontend/app/globals.css',
    title: 'Global Styling & Tailwind CSS Theme',
    desc: 'Defines the clean hospital white and slate color system (#306CE9 medical blue, neutral slate borders), scrollbar formatting, and glassmorphism panel styles.'
  },
  {
    path: 'frontend/app/(auth)/login/page.jsx',
    title: 'Hospital Portal Authentication Desk',
    desc: 'Authenticates all 5 hospital roles. Enforces password checks, verifies Admin approval status on accounts (blocks unapproved staff), and provides quick-fill evaluation chips.'
  },
  {
    path: 'frontend/app/(auth)/register/page.jsx',
    title: 'Multi-Role User & Staff Registration',
    desc: 'Allows real patients and staff to register with their own name, email, password, and specialty/license. Sets all first-time sign-ups to PENDING for Admin verification.'
  },
  {
    path: 'frontend/app/(dashboard)/layout.jsx',
    title: 'Global Dashboard Shell & Protected Route Guard',
    desc: 'Guards all /admin, /doctor, /medical, /lab, and /patient routes. Redirects unauthorized users to /login, displays user role identity badges, and manages secure sign-out.'
  },
  {
    path: 'frontend/app/(dashboard)/(patient)/patient/dashboard/page.jsx',
    title: 'Patient Diagnostic Portal & AI Scanner',
    desc: 'Enables patients to upload skin lesion dermoscopy images, tag anatomical body regions on a 3D model, view clinical ABCDE criteria, and route cases to the doctor.'
  },
  {
    path: 'frontend/app/(dashboard)/(patient)/patient/records/page.jsx',
    title: 'Patient Electronic Health Records (EHR)',
    desc: 'Comprehensive patient portal with 3 tabs: Physician Consultations (with downloadable Vector PDF report), Pharmacy Prescription fulfillment, and Pathology Lab biopsy findings.'
  },
  {
    path: 'frontend/app/(dashboard)/(patient)/patient/appointments/page.jsx',
    title: 'Patient Appointments Schedule',
    desc: 'Displays upcoming and historical clinical consultations, assigned specialist doctor names, consultation suite rooms, and appointment time slots.'
  },
  {
    path: 'frontend/app/(dashboard)/(doctor)/doctor/dashboard/page.jsx',
    title: 'Attending Physician Clinical Desk & Triage',
    desc: 'Displays incoming patient dermoscopy evaluations. Features interactive modals for the doctor to prescribe custom medicines (dispatched to Pharmacy) and order punch biopsies (dispatched to Lab).'
  },
  {
    path: 'frontend/app/(dashboard)/(doctor)/doctor/patients/page.jsx',
    title: 'Hospital Patient Registry Directory',
    desc: 'Searchable clinical database of all patients undergoing automated AI dermoscopy and active specialist follow-ups.'
  },
  {
    path: 'frontend/app/(dashboard)/(doctor)/doctor/xai-analysis/page.jsx',
    title: 'Standalone XAI Lesion Classifier',
    desc: 'Physician tool for direct image upload, deep learning inference, Grad-CAM heatmap visualization, and differential pathology research dossier review.'
  },
  {
    path: 'frontend/app/(dashboard)/(admin)/admin/dashboard/page.jsx',
    title: 'Hospital Admin Operations Tower',
    desc: 'Supervised by waheeddeveloper@gmail.com. Tracks hospital bed capacity, operational KPIs, pending staff approvals count, and patient appointment room dispatch.'
  },
  {
    path: 'frontend/app/(dashboard)/(admin)/admin/users/page.jsx',
    title: 'Central Staff Registry & Approval Control Desk',
    desc: 'Exclusive Admin console featuring the "Registrations Pending Admin Approval" panel. Admin reviews and approves or rejects newly registered Doctors, Patients, Pharmacists, and Lab Specialists.'
  },
  {
    path: 'frontend/app/(dashboard)/(medical)/medical/dashboard/page.jsx',
    title: 'Clinical Pharmacy & Dispensary Desk',
    desc: 'Receives live e-prescriptions dispatched by doctors. Allows pharmacists to verify formulations, record safety counseling, dispense medications, and print pharmacy labels.'
  },
  {
    path: 'frontend/app/(dashboard)/(lab)/lab/dashboard/page.jsx',
    title: 'Dermatopathology & Tissue Biopsy Lab Desk',
    desc: 'Receives punch biopsy orders from doctors. Technicians select tissue stains (Fontana-Masson, H&E), assess microscopic surgical margins, and release finalized pathology certificates.'
  },
  {
    path: 'frontend/app/test-3d/page.jsx',
    title: '3D Anatomical Lesion Radar',
    desc: 'Interactive 3D mesh model allowing patients and physicians to orbit, pan, and mark the spatial anatomical location of cutaneous lesions.'
  },
  {
    path: 'frontend/lib/hospitalStore.js',
    title: 'Hospital Central State & Collaboration Engine',
    desc: 'The central backbone synchronizing live queues between Patients, Doctors, Admin, Pharmacy, and Lab modules. Manages dynamic registrations, approvals, and order dispatch.'
  },
  {
    path: 'frontend/lib/pdfGenerator.js',
    title: 'Official Clinical PDF Generation Engine',
    desc: 'Client-side vector engine utilizing jsPDF to compile official hospital diagnostic summaries complete with hospital letterhead, demographics, ABCDE scores, return code, and digital sign-off.'
  },
  {
    path: 'frontend/components/ClinicalDashboard.jsx',
    title: 'Clinical Lesion Assessment Card Component',
    desc: 'Renders the lesion dermoscopy view, ABCDE criteria breakdown, severity level, and consultation sign-off modal in a hospital EHR aesthetic.'
  },
  {
    path: 'frontend/components/BodySelector.jsx',
    title: 'Anatomical Body Selector Component',
    desc: 'Component providing rapid anatomical region selection (Head, Torso, Arms, Legs) for patient triage intake.'
  }
];

filesData.forEach((item, index) => {
  checkPage(18);

  // Card background
  doc.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252, index % 2 === 0 ? 255 : 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, contentWidth, 14, 1.5, 1.5, 'FD');

  // File Path Badge
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 64, 175);
  doc.text(item.path, margin + 3, yPos + 4);

  // File Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`— ${item.title}`, margin + 3 + (item.path.length * 1.6), yPos + 4);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const splitDesc = doc.splitTextToSize(item.desc, contentWidth - 6);
  doc.text(splitDesc, margin + 3, yPos + 8.5);

  yPos += 16;
});

// 4. Project Defense & Verification Box
checkPage(35);
yPos += 4;
doc.setFillColor(239, 246, 255);
doc.setDrawColor(191, 219, 254);
doc.roundedRect(margin, yPos, contentWidth, 30, 2, 2, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(30, 58, 138);
doc.text('Key Technical Defense Points for University / Dean Presentation', margin + 4, yPos + 6);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(30, 64, 175);
const defensePoints = [
  '• Real-world EHR Integration: Connects Patients, Attending Doctors, Central Pharmacy, and Pathology Lab in real time.',
  '• Administrative Governance: Enforces strict Admin approval on all first-time sign-ups before clinical access is granted.',
  '• Explainable AI (XAI): Diagnostic inference adheres strictly to the clinical ABCDE dermatological guidelines.',
  '• Production Reliability: Fully validated Next.js Turbopack build with 19 static & dynamic routes and zero runtime errors.'
];

let pointY = yPos + 11;
defensePoints.forEach(pt => {
  doc.text(pt, margin + 4, pointY);
  pointY += 4.5;
});

// Page Numbering Footer on all pages
const totalPages = doc.internal.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`DermXAI Technical Architecture Guide • Page ${i} of ${totalPages}`, margin, pageHeight - 6);
  doc.text(`Deployed on Vercel: skin-olive-iota.vercel.app`, pageWidth - margin - 58, pageHeight - 6);
}

// Write to frontend/public and user's Desktop
const publicDest = path.join(__dirname, 'frontend', 'public', 'DermXAI_Project_Code_Guide.pdf');
const desktopDest = path.join('C:', 'Users', 'abdul', 'Desktop', 'DermXAI_Project_Code_Guide.pdf');

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(publicDest, pdfBuffer);
console.log(`Saved PDF to public folder: ${publicDest}`);

try {
  fs.writeFileSync(desktopDest, pdfBuffer);
  console.log(`Saved PDF to Desktop: ${desktopDest}`);
} catch (e) {
  console.warn('Desktop write skipped:', e.message);
}
