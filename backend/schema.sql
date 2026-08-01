-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for User Roles
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'lab_tech', 'pharmacist', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'in_progress');
CREATE TYPE severity_level AS ENUM ('Mild', 'Moderate', 'Severe');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');

-- Users / Profiles Table (Extends Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    phone TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- EHR (Electronic Health Records)
CREATE TABLE ehr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id),
    blood_group TEXT,
    allergies TEXT[],
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    is_telemedicine BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- AI Predictions & XAI
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    image_url TEXT NOT NULL, -- URL to Supabase bucket
    heatmap_url TEXT, -- Grad-CAM output
    predicted_disease TEXT NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    severity severity_level NOT NULL,
    explanation TEXT,
    differential_diagnosis TEXT[],
    doctor_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3D Annotations (Mapping lesions to 3D body parts)
CREATE TABLE body_annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES ai_predictions(id) ON DELETE CASCADE,
    body_part_name TEXT NOT NULL, -- e.g., 'left_arm', 'face'
    position_x DECIMAL,
    position_y DECIMAL,
    position_z DECIMAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Prescriptions
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id),
    doctor_id UUID REFERENCES users(id),
    medications JSONB NOT NULL, -- Array of meds, dosage, frequency
    lab_tests_recommended TEXT[],
    doctor_signature TEXT, -- E-signature reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Billing
CREATE TABLE billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
