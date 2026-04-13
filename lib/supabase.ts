import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export type Treatment = 'invisalign' | 'botox-fillers' | 'implants-veneers' | 'general-dentistry'

export interface Patient {
  id: string
  full_name: string
  phone: string
  email?: string
  source?: string // instagram, whatsapp, walkin, referral
  notes?: string
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  patient?: Patient
  treatment: Treatment
  date: string        // YYYY-MM-DD
  time: string        // HH:MM
  status: AppointmentStatus
  notes?: string
  reminder_sent: boolean
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'doctor' | 'secretary'
  full_name: string
}
