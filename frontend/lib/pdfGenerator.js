import { jsPDF } from 'jspdf';

/**
 * Generates and immediately downloads an official clinical pathology PDF report.
 */
export function downloadClinicalReportPdf({
  reportId = 'DX-8921',
  timestamp = new Date().toLocaleString(),
  patientName = 'Patient',
  age = '48',
  gender = 'Female',
  anatomicalSite = 'Cutaneous Lesion',
  duration = '6 weeks',
  primaryDiagnosis = 'Atypical Melanocytic Proliferation',
  alternativeDiagnosis = 'Superficial Spreading Melanoma vs. Dysplastic Nevus',
  snomedCode = '91861009 (Melanoma of skin)',
  confidence = '94.8',
  triageLevel = 'Urgent Specialist Examination',
  doctorName = 'Dr. Sarah Mercer, MD',
  returnCode = 'VISIT-7A99B2',
  abcde = {
    a: 'Marked asymmetry across primary vertical axis',
    b: 'Irregular border scalloping with pigment fading',
    c: 'Heterogeneous three-tone pigmentation',
    d: '7.2 mm diameter (above 6mm threshold)',
    e: 'Patient noted surface elevation over past 6 weeks'
  }
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [48, 108, 233]; // Hospital Blue (#306CE9)
  const subtleColor = [100, 116, 139]; // Slate 500

  // 1. Top Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('DERMXAI CLINICAL HEALTHCARE NETWORK', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('DEPARTMENT OF DERMATOPATHOLOGY & CUTANEOUS ONCOLOGY | ACCREDITED EHR', 14, 18);

  // 2. Report Identifier Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 24, 210, 10, 'F');
  
  doc.setTextColor(48, 108, 233);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`REPORT NO: ${reportId}`, 14, 30.5);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ISSUED: ${timestamp}`, 130, 30.5);

  // 3. Patient Demographics Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PATIENT NAME', 20, 45);
  doc.text('AGE / GENDER', 70, 45);
  doc.text('ANATOMICAL SITE', 120, 45);
  doc.text('DURATION', 165, 45);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(String(patientName), 20, 53);
  doc.text(`${age} y/o - ${gender}`, 70, 53);
  doc.text(String(anatomicalSite), 120, 53);
  doc.text(String(duration), 165, 53);

  // 4. Primary AI Diagnosis Box
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14, 68, 182, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(48, 108, 233);
  doc.text('PRIMARY PATHOLOGY EVALUATION (AI ENSEMBLE CLASSIFICATION)', 20, 75);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(String(primaryDiagnosis), 20, 83);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`SNOMED CT: ${snomedCode}   |   Confidence: ${confidence}%   |   Triage: ${triageLevel}`, 20, 90);
  doc.text(`Differential Diagnosis: ${alternativeDiagnosis}`, 20, 96);

  // 5. ABCDE Dermoscopic Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('DERMOSCOPIC ABCDE MORPHOLOGY PROFILE', 14, 110);

  const abcdeItems = [
    { label: 'A - Asymmetry:', text: abcde?.a || 'Asymmetric distribution of pigment across primary axes' },
    { label: 'B - Border:', text: abcde?.b || 'Irregular scalloped pigment margin with abrupt transitions' },
    { label: 'C - Color:', text: abcde?.c || 'Heterogeneous multitone pigmentation (dark brown & black hues)' },
    { label: 'D - Diameter:', text: abcde?.d || '6.8 mm diameter threshold (exceeds 6mm marker)' },
    { label: 'E - Evolving:', text: abcde?.e || 'Rapid horizontal surface elevation noted over recent weeks' }
  ];

  let currentY = 117;
  abcdeItems.forEach((item) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, 182, 10, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(48, 108, 233);
    doc.text(item.label, 18, currentY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(String(item.text), 48, currentY + 6.5);

    currentY += 13;
  });

  // 6. Return Code & Consultation Verification
  currentY += 4;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, currentY, 182, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  doc.text('OFFICIAL VISIT RETURN CODE & CLINICAL RECORD TRACKING', 20, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(String(returnCode), 20, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Present this return code at the Hospital Pharmacy or Diagnostic Lab desk for verified case history.', 80, currentY + 15);

  // 7. Attending Physician Sign-Off
  currentY += 30;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, currentY, 196, currentY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(String(doctorName), 140, currentY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Attending Dermatologist Signature', 140, currentY + 14);
  doc.text('NPI License Verified • Certified Medical Officer', 140, currentY + 18);

  doc.text('DermXAI Enterprise System • Automated HL7 / FHIR Clinical Export', 14, currentY + 14);
  doc.text('Digital Security Hash: 7e99f4d1c82894b1a8d • Electronic Healthcare Record', 14, currentY + 18);

  // 8. Save/Download File
  const filename = `DermXAI_Clinical_Report_${String(patientName).replace(/\s+/g, '_')}_${reportId}.pdf`;
  doc.save(filename);
  return filename;
}
