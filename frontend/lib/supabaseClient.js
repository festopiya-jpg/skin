import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a real client if keys exist, otherwise a dummy client
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock login fallback if no Supabase keys are provided yet
export const mockLogin = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let role = 'patient';
      if (email.includes('doctor')) role = 'doctor';
      if (email.includes('admin')) role = 'admin';
      
      resolve({
        user: { id: 'mock-user-id', email, role },
        error: null
      });
    }, 1000);
  });
};

export const mockRegister = async (email, password, name, role) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: { id: 'mock-user-id', email, role, user_metadata: { name } },
        error: null
      });
    }, 1000);
  });
};