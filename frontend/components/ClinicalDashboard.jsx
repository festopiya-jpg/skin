'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, ShieldCheck, Share2, ArrowLeft, RefreshCw, 
  MapPin, CheckCircle2, ChevronRight, Activity, Calendar, User, 
  ExternalLink, Sparkles, AlertTriangle, AlertCircle, Info, Clock,
  Printer, X, Check, Database, Server, ChevronDown, Download
} from 'lucide-react';
import { downloadClinicalReportPdf } from '@/lib/pdfGenerator';

export default function ClinicalDashboard({
  metadata,
  imagePreview,
  onReset,
}) {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showEhrModal, setShowEhrModal] = useState(false);
  const [ehrSynced, setEhrSynced] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [reportId] = useState(() => `DX-${Math.floor(10000 + Math.random() * 90000)}`);
  const [timestamp] = useState(() => new Date().toLocaleString('en-US'));

  // Simulate AI diagnostic scan on load
  useEffect(() => {
    const duration = 1800; // 1.8 seconds scan
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      setScanProgress(Math.floor(progress));
      
      if (progress >= 100) {
        clearInterval(timer);
        setIsScanning(false);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Compute diagnosis details based on anatomical location to make it feel dynamic
  const getDiagnosticDetails = (location) => {
    switch (location) {
      case 'Head':
        return {
          primaryDiagnosis: 'Atypical Melanocytic Proliferation',
          alternativeDiagnosis: 'Superficial Spreading Melanoma (SSM) vs. Dysplastic Nevus',
          snomedCode: '91861009 (Melanoma of skin)',
          confidence: 94.8,
          triageLevel: 'Critical',
          triageColor: 'bg-red-500/20 border-red-500/40 text-red-400',
          triageBadge: 'bg-red-500 text-white',
          riskScore: 8.9,
          actionPlan: [
            'Immediate referral to Dermatologist for excisional biopsy within 48 hours.',
            'Perform dermoscopic assessment of local lymph node stations.',
            'Advise patient on sun protection and strict surveillance of surrounding sites.'
          ],
          abcde: {
            a: 'Asymmetric distribution of pigment across vertical and horizontal planes',
            b: 'Irregular, notched, and poorly defined borders with geographic contours',
            c: 'Variegation with dark brown, light brown, and bluish-grey hues',
            d: '7.8 mm (exceeds standard 6mm clinical threshold)',
            e: 'Rapid horizontal expansion noted over past 3-6 weeks'
          }
        };
      case 'Torso':
        return {
          primaryDiagnosis: 'Severely Dysplastic Junctional Nevus',
          alternativeDiagnosis: 'Early Stage Melanoma in-situ vs. Pigmented Basal Cell Carcinoma',
          snomedCode: '400096001 (Dysplastic naevus syndrome)',
          confidence: 89.2,
          triageLevel: 'Urgent',
          triageColor: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
          triageBadge: 'bg-amber-500 text-slate-950',
          riskScore: 7.2,
          actionPlan: [
            'Dermatology specialist consultation requested within 7 days.',
            'Plan for standard punch biopsy of the lateral margins (2mm clearance).',
            'Capture clinical baseline macrophotography for serial comparison.'
          ],
          abcde: {
            a: 'Moderate asymmetry across vertical axis with eccentric pigment core',
            b: 'Mild border irregularity with slight scalloping and indistinct margins',
            c: 'Two-tone pigmentation (uniform dark brown core with light tan halo)',
            d: '6.4 mm (slightly above 6mm threshold)',
            e: 'Patient reports gradual thickening over the past month'
          }
        };
      case 'Left Arm':
      case 'Right Arm':
        return {
          primaryDiagnosis: 'Pigmented Basal Cell Carcinoma',
          alternativeDiagnosis: 'Actinic Keratosis vs. Squamous Cell Carcinoma in-situ',
          snomedCode: '1338007 (Basal cell carcinoma)',
          confidence: 91.5,
          triageLevel: 'Urgent',
          triageColor: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
          triageBadge: 'bg-amber-500 text-slate-950',
          riskScore: 6.8,
          actionPlan: [
            'Schedule specialist assessment for excision or Mohs micrographic surgery.',
            'Instruct patient to monitor for ulceration, bleeding, or weeping.',
            'Prescribe topical treatments if superficial variant is confirmed post-biopsy.'
          ],
          abcde: {
            a: 'Asymmetry of structural features and color zones',
            b: 'Rolled, translucent border with arborizing telangiectasia',
            c: 'Pigment dispersion with black speckles on pink erythematous base',
            d: '5.2 mm (within normal diameter limits)',
            e: 'Bleeding reported upon minor mechanical friction'
          }
        };
      case 'Left Leg':
      case 'Right Leg':
      default:
        return {
          primaryDiagnosis: 'Atypical Junctional Melanocytic Nevus',
          alternativeDiagnosis: 'Seborrheic Keratosis vs. Dermatofibroma',
          snomedCode: '2092003 (Melanocytic nevus)',
          confidence: 86.4,
          triageLevel: 'Routine',
          triageColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
          triageBadge: 'bg-cyan-500 text-slate-950',
          riskScore: 4.5,
          actionPlan: [
            'Routine follow-up assessment in 3 to 6 months suggested.',
            'Provide patient education material on the ABCDE screening criteria.',
            'Advise photography tracking of the spot at monthly intervals.'
          ],
          abcde: {
            a: 'Minimal vertical and horizontal axis asymmetry',
            b: 'Sharply demarcated borders without notches',
            c: 'Homogenous brown color distribution across surface',
            d: '4.8 mm (below 6mm threshold)',
            e: 'Stable according to clinical history; asymptomatic'
          }
        };
    }
  };

  const dx = getDiagnosticDetails(metadata.selectedLocation);

  const fhirPayload = {
    resourceType: "Bundle",
    id: `bundle-${reportId.toLowerCase()}`,
    type: "transaction",
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: "Patient",
          id: `pat-${metadata.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: [{ use: "official", text: metadata.name }],
          gender: metadata.gender.toLowerCase(),
          extension: [{ url: "http://hl7.org/fhir/StructureDefinition/patient-age", valueInteger: metadata.age }]
        }
      },
      {
        resource: {
          resourceType: "DiagnosticReport",
          id: reportId.toLowerCase(),
          status: "final",
          category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0074", code: "DERM", display: "Dermatology" }] }],
          code: {
            coding: [{ system: "http://snomed.info/sct", code: dx.snomedCode.split(' ')[0], display: dx.primaryDiagnosis }]
          },
          bodySite: {
            coding: [{ system: "http://snomed.info/sct", display: metadata.selectedLocation }]
          },
          conclusion: `${dx.primaryDiagnosis} (${dx.confidence}% confidence). Recommended Triage: ${dx.triageLevel}.`,
          issued: new Date().toISOString()
        }
      }
    ]
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 flex flex-col h-full shadow-sm text-gray-900 justify-between relative">
      {isScanning ? (
        /* Clinical Imaging Analysis Loader Screen */
        <div className="flex-1 flex flex-col items-center justify-center my-12">
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mb-6 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Diagnostic Scan Target" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>

          <div className="w-72 bg-gray-100 border border-gray-200 h-2.5 rounded-full overflow-hidden mb-3">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-150"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-800 tracking-wide">
            Processing Dermoscopic Image... {scanProgress}%
          </span>
          <span className="text-xs text-gray-500 mt-1">Evaluating ABCDE lesion morphology and margin contours...</span>
        </div>
      ) : (
        /* Final Clinical Diagnostic Summary Screen */
        <div className="flex-grow flex flex-col">
          {/* Header Action Row */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Intake Form</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <span>SCAN-ID:</span>
              <span className="text-blue-600 font-bold">{reportId}</span>
            </div>
          </div>

          {/* Patient Details Sub-header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl mb-6 text-gray-800">
            <div className="flex items-center gap-2">
              <User size={15} className="text-gray-400" />
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 uppercase block font-medium">Patient</span>
                <span className="text-xs font-bold text-gray-900 block truncate">{metadata.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-gray-400" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-medium">Age / Gender</span>
                <span className="text-xs font-bold text-gray-900 block truncate">{metadata.age} y/o • {metadata.gender}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-gray-400" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-medium">Duration</span>
                <span className="text-xs font-bold text-gray-900 block truncate">{metadata.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-gray-400" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-medium">Anatomical Site</span>
                <span className="text-xs font-bold text-blue-700 block truncate">{metadata.selectedLocation}</span>
              </div>
            </div>
          </div>

          {/* Main Core Scan Details Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Scanned Image Box */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Lesion Analyzed" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white/95 border border-gray-200 text-[10px] font-bold text-emerald-700 shadow-sm whitespace-nowrap flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Dermoscopy Verified</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 text-center">Standard Polarized Lesion Area</p>
            </div>

            {/* AI Diagnosis Details */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">PRIMARY PATHOLOGY EVALUATION</span>
                  <span className="text-[10px] text-blue-700 font-semibold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                    Deep Ensemble Analysis
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-1">
                  {dx.primaryDiagnosis}
                </h3>

                <p className="text-xs text-gray-600 mb-4">
                  <span className="font-semibold text-gray-700">Differential: </span>
                  <span className="italic">{dx.alternativeDiagnosis}</span>
                </p>

                {/* Score indicators */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50/60 border border-blue-200 p-3.5 rounded-xl">
                    <span className="text-[10px] text-blue-800 uppercase block font-semibold">Model Confidence</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-bold text-blue-700">{dx.confidence}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Risk Factor Score</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-bold text-gray-900">{dx.riskScore}</span>
                      <span className="text-xs text-gray-500">/10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Triage Level Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                dx.triageLevel === 'Critical' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                dx.triageLevel === 'Urgent' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-gray-200 flex-shrink-0">
                    {dx.triageLevel === 'Critical' ? (
                      <AlertCircle size={20} className="text-rose-600" />
                    ) : dx.triageLevel === 'Urgent' ? (
                      <AlertTriangle size={20} className="text-amber-600" />
                    ) : (
                      <Info size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">Clinical Triage Recommendation</span>
                    <span className="text-sm font-bold tracking-wide">
                      {dx.triageLevel === 'Critical' && 'IMMEDIATE EXCISION ADVISED'}
                      {dx.triageLevel === 'Urgent' && 'URGENT SPECIALIST EXAMINATION'}
                      {dx.triageLevel === 'Routine' && 'ROUTINE SURVEILLANCE'}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  dx.triageLevel === 'Critical' ? 'bg-rose-600 text-white' :
                  dx.triageLevel === 'Urgent' ? 'bg-amber-600 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {dx.triageLevel}
                </span>
              </div>
            </div>
          </div>

          {/* ABCDE Clinical Checklist Section */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 font-mono flex items-center gap-2">
              <Activity size={13} className="text-blue-600" />
              ABCDE DERMATOLOGY PROFILE
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-3.5 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-blue-700 font-mono">A - Asymmetry</span>
                  <span className="text-xs text-gray-700 font-medium leading-relaxed">{dx.abcde.a}</span>
                </div>
                <div className="p-3.5 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-blue-700 font-mono">B - Border</span>
                  <span className="text-xs text-gray-700 font-medium leading-relaxed">{dx.abcde.b}</span>
                </div>
                <div className="p-3.5 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-blue-700 font-mono">C - Color</span>
                  <span className="text-xs text-gray-700 font-medium leading-relaxed">{dx.abcde.c}</span>
                </div>
                <div className="p-3.5 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-blue-700 font-mono">D - Diameter</span>
                  <span className="text-xs text-gray-700 font-medium leading-relaxed">{dx.abcde.d}</span>
                </div>
                <div className="p-3.5 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-blue-700 font-mono">E - Evolving</span>
                  <span className="text-xs text-gray-700 font-medium leading-relaxed">{dx.abcde.e}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 font-mono flex items-center gap-2">
              <ShieldCheck size={13} className="text-emerald-600" />
              SUGGESTED CLINICAL INTERVENTIONS
            </h4>
            <ul className="space-y-2">
              {dx.actionPlan.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700 leading-normal bg-gray-50 border border-gray-100 p-2.5 rounded-lg">
                  <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Footer Utility Actions */}
      <div className="border-t border-gray-200 pt-5 mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 bg-white rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw size={14} />
          <span>New Patient Scan</span>
        </button>

        <button
          onClick={() => setShowPdfModal(true)}
          className="flex-1 py-3 border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 rounded-xl text-xs font-bold uppercase tracking-wider text-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <FileText size={14} />
          <span>Export Clinical PDF</span>
        </button>

        <button
          onClick={() => setShowEhrModal(true)}
          className="flex-1 py-3 bg-[#306CE9] hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <ExternalLink size={14} />
          <span>Save to Hospital Record</span>
        </button>
      </div>

      {/* Clinical PDF Report Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn print:p-0 print:m-0 print:bg-white print:static print:block">
          <div
            id="printable-pathology-report"
            className="bg-white border border-gray-200 w-full max-w-3xl rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative text-gray-900 print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-4 print:bg-white print:text-slate-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 print:border-slate-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-wide">CLINICAL PATHOLOGY REPORT</h3>
                  <p className="text-xs text-gray-500 font-mono">REPORT NO: {reportId} • ISSUED: {timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors no-print cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Report Body */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Patient Name</span>
                  <span className="font-bold text-gray-900">{metadata.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Age / Gender</span>
                  <span className="font-bold text-gray-900">{metadata.age} y/o • {metadata.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Anatomical Site</span>
                  <span className="font-bold text-blue-700">{metadata.selectedLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Duration</span>
                  <span className="font-bold text-gray-900">{metadata.duration}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-300 flex-shrink-0 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Lesion" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                      PRIMARY DIAGNOSIS
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{dx.snomedCode}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">{dx.primaryDiagnosis}</h4>
                  <p className="text-xs text-gray-600">
                    <strong className="text-gray-800">Differential: </strong> {dx.alternativeDiagnosis}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono pt-1 text-gray-700">
                    <span>Model Confidence: <strong className="text-blue-700 font-bold">{dx.confidence}%</strong></span>
                    <span>Triage: <strong className="text-amber-700 font-bold">{dx.triageLevel}</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 font-mono">
                  Dermoscopic ABCDE Evaluation
                </h5>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex gap-2">
                    <span className="font-bold text-blue-700 font-mono w-24 flex-shrink-0">A - Asymmetry:</span>
                    <span className="text-gray-800">{dx.abcde.a}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex gap-2">
                    <span className="font-bold text-blue-700 font-mono w-24 flex-shrink-0">B - Border:</span>
                    <span className="text-gray-800">{dx.abcde.b}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex gap-2">
                    <span className="font-bold text-blue-700 font-mono w-24 flex-shrink-0">C - Color:</span>
                    <span className="text-gray-800">{dx.abcde.c}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex gap-2">
                    <span className="font-bold text-blue-700 font-mono w-24 flex-shrink-0">D - Diameter:</span>
                    <span className="text-gray-800">{dx.abcde.d}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex gap-2">
                    <span className="font-bold text-blue-700 font-mono w-24 flex-shrink-0">E - Evolving:</span>
                    <span className="text-gray-800">{dx.abcde.e}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-gray-500 font-mono">
                <div>
                  <p>Certified Electronic Record • DermXAI Healthcare Systems</p>
                  <p>Attending: Dr. Sarah Mercer, MD (NPI: 1849204921)</p>
                </div>
                <div className="border-t border-gray-400 pt-1 w-48 text-right">
                  <span className="block text-[11px] text-gray-800 italic">Dr. Sarah Mercer, MD</span>
                  <span className="text-[10px] text-gray-500">Attending Dermatologist Sign-off</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-slate-800 mt-6 no-print">
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  try {
                    downloadClinicalReportPdf({
                      reportId,
                      timestamp,
                      patientName: metadata.name,
                      age: metadata.age,
                      gender: metadata.gender,
                      anatomicalSite: metadata.selectedLocation,
                      duration: metadata.duration,
                      primaryDiagnosis: dx.primaryDiagnosis,
                      alternativeDiagnosis: dx.alternativeDiagnosis,
                      snomedCode: dx.snomedCode,
                      confidence: dx.confidence,
                      triageLevel: dx.triageLevel,
                      abcde: dx.abcde
                    });
                  } catch (e) {
                    console.error(e);
                    window.print();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                <Download size={15} />
                <span>Download PDF File</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
              >
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hospital EHR Database Sync Modal */}
      {showEhrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl relative text-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                  <Server size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-wide">Save to Hospital Clinical Database</h3>
                  <p className="text-xs text-gray-500">Electronic Health Record (EHR) • Central Patient Archive</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEhrModal(false);
                  setEhrSynced(false);
                  setShowRawJson(false);
                }}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-4">
              {/* Connection Status Bar */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Database size={15} className="text-blue-600" />
                  <span className="font-semibold text-gray-700">Hospital Central System:</span>
                  <span className="text-gray-500 font-mono">Main Server (Connected)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${ehrSynced ? 'bg-emerald-500' : 'bg-emerald-500'}`} />
                  <span className="font-mono font-bold text-[11px] text-emerald-700">
                    {ehrSynced ? 'TRANSMISSION COMPLETE' : 'READY TO SYNC'}
                  </span>
                </div>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Patient</span>
                  <span className="font-bold text-gray-900 text-sm">{metadata.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">3D Body Region</span>
                  <span className="font-bold text-blue-700 text-sm">{metadata.selectedLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Diagnosis</span>
                  <span className="font-bold text-gray-900 text-xs truncate block" title={dx.primaryDiagnosis}>
                    {dx.primaryDiagnosis}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Confidence</span>
                  <span className="font-bold text-emerald-700 text-sm">{dx.confidence}%</span>
                </div>
              </div>

              {/* Success Banner */}
              {ehrSynced ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3 animate-fadeIn">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-900 text-sm">Successfully Synced with Hospital Record!</p>
                    <p className="text-emerald-700 leading-relaxed">
                      The patient file has been updated with the 3D anatomical tag (<strong>{metadata.selectedLocation}</strong>), AI diagnostic scan, and recommended clinical triage plan.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
                  <Info size={16} className="text-blue-600 flex-shrink-0" />
                  <span>Click <strong>&quot;Sync to Hospital Database&quot;</strong> below to securely store this diagnosis in the patient&apos;s hospital file.</span>
                </div>
              )}

              {/* Technical Details Accordion (HL7 FHIR Interoperability Payload) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>Technical Standard: HL7® FHIR® v4 Standard JSON</span>
                  </span>
                  <span className="text-blue-600 text-xs font-sans font-medium">
                    {showRawJson ? '▲ Hide FHIR JSON' : '▼ View Interoperability FHIR Payload'}
                  </span>
                </button>
                {showRawJson && (
                  <pre className="p-3 border-t border-gray-200 font-mono text-[10px] text-gray-800 max-h-48 overflow-y-auto leading-relaxed bg-white">
                    {JSON.stringify(fhirPayload, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                  setShowEhrModal(false);
                  setEhrSynced(false);
                  setShowRawJson(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => setEhrSynced(true)}
                disabled={ehrSynced}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  ehrSynced
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-800 cursor-default'
                    : 'bg-[#306CE9] hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {ehrSynced ? <Check size={15} /> : <Server size={15} />}
                <span>{ehrSynced ? 'Record Synced ✓' : 'Sync to Hospital Database'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
