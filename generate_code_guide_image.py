import os
from PIL import Image, ImageDraw, ImageFont

def create_guide_image():
    # Width 1080px (Standard mobile width for crisp viewing & zoom)
    width = 1080
    # Estimated height
    height = 4200

    # Create base image with deep hospital slate background
    img = Image.new('RGB', (width, height), color='#071422')
    draw = ImageDraw.Draw(img)

    # Fonts
    font_dir = 'C:/Windows/Fonts/'
    def get_font(name, size):
        try:
            return ImageFont.truetype(os.path.join(font_dir, name), size)
        except:
            return ImageFont.load_default()

    font_title = get_font('segoeuib.ttf', 44)
    font_subtitle = get_font('segoeui.ttf', 24)
    font_sec_heading = get_font('segoeuib.ttf', 30)
    font_card_title = get_font('segoeuib.ttf', 24)
    font_body = get_font('segoeui.ttf', 19)
    font_body_bold = get_font('segoeuib.ttf', 19)
    font_code = get_font('consola.ttf', 18)
    font_badge = get_font('segoeuib.ttf', 16)
    font_small = get_font('segoeui.ttf', 16)

    y = 0

    # 1. TOP HEADER BANNER
    header_h = 240
    draw.rectangle([0, 0, width, header_h], fill='#05101C')
    # Gold top accent line
    draw.rectangle([0, 0, width, 8], fill='#D4A034')

    # Hospital Brand
    draw.text((50, 36), "DERMXAI MULTI-SPECIALITY HOSPITAL", font=font_badge, fill='#D4A034')
    draw.text((50, 68), "Complete Project & Code Architecture Guide", font=font_title, fill='#FFFFFF')
    draw.text((50, 130), "End-to-End Hospital Flow • What Every Code & File Does • Production Mobile Sheet", font=font_subtitle, fill='#94A3B8')

    # Badges
    badges = ["Next.js 16 (App Router)", "PhonePe UPI QR Pay", "AI Dermoscopy", "Full Hospital EHR", "Multi-Role RBAC"]
    bx = 50
    for b in badges:
        bw = draw.textlength(b, font=font_small) + 24
        draw.rounded_rectangle([bx, 185, bx + bw, 218], radius=8, fill='#0E243A', outline='#1E4064', width=1)
        draw.text((bx + 12, 193), b, font=font_small, fill='#38BDF8')
        bx += bw + 12

    y = header_h + 40

    def draw_section_heading(text, icon_badge=""):
        nonlocal y
        draw.rounded_rectangle([50, y, 78, y + 36], radius=6, fill='#306CE9')
        draw.text((95, y + 2), text, font=font_sec_heading, fill='#FFFFFF')
        y += 54

    # -------------------------------------------------------------
    # SECTION 1: END-TO-END WORKFLOW
    # -------------------------------------------------------------
    draw_section_heading("PART 1: Complete Patient & Clinical Hospital Flow")

    steps = [
        ("Step 1: Patient Registration (Zero Approval Delay)",
         "New patients register with Name, Email & Password. Patients are AUTO-APPROVED immediately with zero admin wait time, giving instant access to consultation booking.",
         "#10B981"),
        ("Step 2: Consultation Booking & PhonePe QR Payment",
         "Patient selects attending physician, scans authentic PhonePe QR poster (Payee: ABDUL WAHEED • Fee: ₹500.00), and enters their 12-digit UPI UTR transaction reference number.",
         "#306CE9"),
        ("Step 3: Hospital Admin Payment Verification & Gmail Dispatch",
         "Hospital Admin verifies the ₹500 fee and UTR, assigns consultation date/time and room, and clicks 'Approve & Send Gmail'. An official email confirmation is dispatched.",
         "#D4A034"),
        ("Step 4: AI Dermoscopy Scan & Disease Photos Dossier",
         "Patient uploads photos of rashes, spots, or lesions. Instant ensemble AI produces condition classification, confidence %, ABCDE biomarkers, and queues report to the doctor.",
         "#8B5CF6"),
        ("Step 5: Attending Physician Desk (Doctor Review)",
         "Doctor inspects high-res lesion photos, AI confidence, and ABCDE biomarkers. Doctor issues e-prescriptions directly to Pharmacy or orders histopathology biopsy to Lab.",
         "#EC4899"),
        ("Step 6: Hospital Pharmacy (Medical Specialist)",
         "Pharmacy specialist receives doctor e-prescriptions, verifies clinical dosage and inventory stock, and dispenses medication with patient counseling notes.",
         "#06B6D4"),
        ("Step 7: Pathology Lab Diagnostics (Lab Specialist)",
         "Lab receives surgical punch biopsy orders, prepares tissue specimens (Fontana-Masson / H&E stains), determines microscopic tumor margins, and enters diagnostic findings.",
         "#F59E0B")
    ]

    for title, desc, color in steps:
        card_h = 100
        draw.rounded_rectangle([50, y, width - 50, y + card_h], radius=14, fill='#0B1F33', outline='#173654', width=1)
        # Left color bar
        draw.rounded_rectangle([50, y, 58, y + card_h], radius=4, fill=color)
        draw.text((75, y + 16), title, font=font_card_title, fill='#FFFFFF')
        
        # Word wrap desc
        words = desc.split(' ')
        lines = []
        cur_line = []
        for w in words:
            cur_line.append(w)
            if draw.textlength(' '.join(cur_line), font=font_body) > (width - 150):
                cur_line.pop()
                lines.append(' '.join(cur_line))
                cur_line = [w]
        if cur_line:
            lines.append(' '.join(cur_line))

        line_y = y + 50
        for l in lines[:2]:
            draw.text((75, line_y), l, font=font_body, fill='#CBD5E1')
            line_y += 24

        y += card_h + 16

    y += 30

    # -------------------------------------------------------------
    # SECTION 2: A TO Z CODE & FILE GUIDE
    # -------------------------------------------------------------
    draw_section_heading("PART 2: What Every File & Code Does (A to Z Guide)")

    files = [
        ("frontend/lib/hospitalStore.js", "Hospital EHR State Machine & Database",
         "The central brain of the hospital EHR. Handles user auth, auto-approval for patients, admin gate for staff, PhonePe ₹500 fee records, UTR verification, appointments, prescriptions, and lab queues in persistent local storage."),
        
        ("frontend/app/page.jsx", "Hospital Landing Page & Emergency Desk",
         "Public hospital portal matching momhospital.in styling. Contains Emergency 24/7 hotline (+91 891 278 8999), specialist doctor directory, departmental schedules, OPD timings, and patient reviews."),
        
        ("frontend/app/(auth)/login/page.jsx", "Hospital Tabbed Authentication Portal",
         "Dual-portal login with separate tabs for 'Patient Login' (instant access) and 'Sign In as Staff' (Admin, Doctor, Pharmacy, Lab). Securely manages role redirection without exposing credentials."),
        
        ("frontend/app/(auth)/register/page.jsx", "Hospital Registration Desk",
         "Dual-tier signup engine. Patients register with instant auto-approval. Clinical staff (Doctor, Pharmacy, Lab) accounts are routed to the Admin Tower for certification and licensing approval."),
        
        ("frontend/app/(dashboard)/layout.jsx", "Institutional Dashboard Shell & Nav",
         "Clinical EHR dashboard layout with emergency utility header (+91 891 278 8999), hospital crest, deep navy theme (#07213A), active department indicators, and OPD clinical duty rosters."),
        
        ("frontend/app/(dashboard)/(patient)/patient/dashboard/page.jsx", "Patient Diagnostic Portal & AI Dossier",
         "Patient hub featuring interactive 3D anatomical map, lesion photo upload, AI dermoscopy scan with ABCDE biomarkers, doctor transmission receipt, and full EHR clinical report viewer with PDF download."),
        
        ("frontend/app/(dashboard)/(patient)/patient/appointments/page.jsx", "Appointment Booking & PhonePe QR Pay",
         "Consultation booking desk. Embeds the authentic PhonePe QR code for ABDUL WAHEED, accepts ₹500 payment, collects 12-digit UPI UTR reference, and delivers real-time admin dispatch notices."),
        
        ("frontend/app/(dashboard)/(patient)/patient/records/page.jsx", "Patient Medical Records & Clinical Dossiers",
         "Patient archive of confirmed physician consultations, pharmacy dispensations, pathology biopsy reports, and downloadable official clinical pathology PDF documents."),
        
        ("frontend/app/(dashboard)/(doctor)/doctor/dashboard/page.jsx", "Physician Clinical Desk & Diagnostic Queue",
         "Attending doctor workplace. Reviews patient lesion scans, inspects uploaded photos with ABCDE dermoscopy metrics, writes e-prescriptions to Pharmacy, or orders punch biopsies to Pathology Lab."),
        
        ("frontend/app/(dashboard)/(admin)/admin/dashboard/page.jsx", "Hospital Admin Control Tower",
         "Supervisory administration hub. Verifies ₹500 payments and UPI UTR numbers, schedules patient appointments, assigns consultation rooms, and licenses pending clinical staff."),
        
        ("frontend/app/(dashboard)/(medical)/medical/dashboard/page.jsx", "Hospital Pharmacy Dispensation Desk",
         "Clinical pharmacy management. Queues prescription orders sent by attending doctors, tracks medicine quantities and dosages, verifies pharmacist dispensing, and records patient counseling."),
        
        ("frontend/app/(dashboard)/(lab)/lab/dashboard/page.jsx", "Pathology & Biopsy Diagnostic Lab",
         "Clinical laboratory console. Processes histopathology orders dispatched by doctors, records tissue specimen accession numbers, stains, and microscopic evaluation findings."),
        
        ("frontend/components/ClinicalDashboard.jsx", "AI Dermoscopy & Biomarkers Engine",
         "Interactive polarized dermoscopy analyzer. Generates ABCDE criteria (Asymmetry, Border, Color, Diameter, Evolution), calculates SNOMED-CT codes, triage urgency levels, and research dossiers."),
        
        ("frontend/lib/pdfGenerator.js", "Clinical PDF Export Engine (jsPDF)",
         "Generates official institutional medical reports complete with hospital letterhead, patient ID, anatomical site, confidence scores, ABCDE tables, and attending physician sign-offs.")
    ]

    for fpath, role, desc in files:
        card_h = 125
        draw.rounded_rectangle([50, y, width - 50, y + card_h], radius=14, fill='#0B1F33', outline='#173654', width=1)
        
        # File path
        draw.text((75, y + 14), fpath, font=font_code, fill='#38BDF8')
        # Role
        draw.text((75, y + 38), role, font=font_card_title, fill='#D4A034')

        # Word wrap desc
        words = desc.split(' ')
        lines = []
        cur_line = []
        for w in words:
            cur_line.append(w)
            if draw.textlength(' '.join(cur_line), font=font_body) > (width - 150):
                cur_line.pop()
                lines.append(' '.join(cur_line))
                cur_line = [w]
        if cur_line:
            lines.append(' '.join(cur_line))

        line_y = y + 70
        for l in lines[:2]:
            draw.text((75, line_y), l, font=font_body, fill='#CBD5E1')
            line_y += 24

        y += card_h + 16

    # Crop to final height
    final_img = img.crop((0, 0, width, y + 40))
    
    # Save locations
    destinations = [
        r'C:\Users\abdul\Desktop\DermXAI_Code_Explanation_Guide.png',
        r'C:\Users\abdul\Desktop\skin-repo\frontend\public\DermXAI_Code_Explanation_Guide.png',
        r'C:\Users\abdul\.gemini\antigravity\brain\c1bf92db-afcc-4cd4-bf8b-131a179e2e44\DermXAI_Code_Explanation_Guide.png'
    ]

    for d in destinations:
        os.makedirs(os.path.dirname(d), exist_ok=True)
        final_img.save(d, 'PNG', optimize=True)
        print(f"Saved: {d}")

if __name__ == '__main__':
    create_guide_image()
