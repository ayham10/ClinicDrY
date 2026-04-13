-- ============================================
-- DR. YARA SALEM CLINIC — DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New Query
-- ============================================

-- 1. PATIENTS TABLE
create table if not exists patients (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone text not null,
  email text,
  source text default 'website', -- website | instagram | whatsapp | walkin | referral
  notes text,
  created_at timestamptz default now()
);

-- 2. APPOINTMENTS TABLE
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references patients(id) on delete cascade,
  treatment text not null, -- invisalign | botox-fillers | implants-veneers | general-dentistry
  date date not null,
  time time not null,
  status text default 'pending', -- pending | confirmed | cancelled | completed | no_show
  notes text,
  reminder_sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. ADMIN USERS TABLE (stores role info — auth is handled by Supabase Auth)
create table if not exists admin_users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text default 'secretary' -- doctor | secretary
);

-- 4. AUTO-UPDATE updated_at on appointments
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger appointments_updated_at
  before update on appointments
  for each row execute function update_updated_at();

-- 5. ROW LEVEL SECURITY — only logged-in admin users can access
alter table patients enable row level security;
alter table appointments enable row level security;
alter table admin_users enable row level security;

-- Policies: allow all operations for authenticated users (admins)
create policy "Authenticated users can do everything on patients"
  on patients for all using (auth.role() = 'authenticated');

create policy "Authenticated users can do everything on appointments"
  on appointments for all using (auth.role() = 'authenticated');

create policy "Authenticated users can read admin_users"
  on admin_users for select using (auth.role() = 'authenticated');

-- 6. SEED DEMO DATA (optional — you can delete this later)
-- First insert sample patients
insert into patients (full_name, phone, email, source) values
  ('Sara Khalil',   '+972501234567', 'sara@example.com',  'instagram'),
  ('Lina Mansour',  '+972507654321', 'lina@example.com',  'website'),
  ('Rami Abboud',   '+972509876543', null,                'whatsapp'),
  ('Nadia Saleh',   '+972502345678', 'nadia@example.com', 'referral'),
  ('Karim Haddad',  '+972508765432', null,                'walkin');

-- Then insert appointments for the current month
insert into appointments (patient_id, treatment, date, time, status) values
  ((select id from patients where full_name='Sara Khalil'),   'invisalign',          current_date + interval '1 day',  '09:00', 'confirmed'),
  ((select id from patients where full_name='Lina Mansour'),  'botox-fillers',       current_date + interval '1 day',  '11:00', 'pending'),
  ((select id from patients where full_name='Rami Abboud'),   'implants-veneers',    current_date + interval '2 days', '14:30', 'confirmed'),
  ((select id from patients where full_name='Nadia Saleh'),   'general-dentistry',   current_date + interval '3 days', '10:00', 'pending'),
  ((select id from patients where full_name='Karim Haddad'),  'botox-fillers',       current_date + interval '5 days', '15:00', 'confirmed'),
  ((select id from patients where full_name='Sara Khalil'),   'general-dentistry',   current_date - interval '7 days', '09:00', 'completed'),
  ((select id from patients where full_name='Lina Mansour'),  'invisalign',          current_date - interval '14 days','11:00', 'completed'),
  ((select id from patients where full_name='Rami Abboud'),   'botox-fillers',       current_date - interval '3 days', '13:00', 'cancelled');
