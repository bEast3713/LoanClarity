-- LoanClarity schema (hackathon prototype)

create extension if not exists "uuid-ossp";

create table if not exists public.colleges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  nirf_rank int,
  state text,
  type text,
  website text,
  updated_at timestamp with time zone default now()
);

create table if not exists public.course_fees (
  id uuid primary key default uuid_generate_v4(),
  college_id uuid references public.colleges(id) on delete cascade,
  course text not null,
  year int not null check (year between 1 and 6),
  tuition_fee numeric,
  hostel_fee numeric,
  exam_fee numeric,
  misc_fee numeric,
  source text,
  updated_at timestamp with time zone default now()
);

create index if not exists idx_course_fees_college_course
  on public.course_fees (college_id, course, year);

create table if not exists public.bank_loan_rates (
  id uuid primary key default uuid_generate_v4(),
  bank_name text not null,
  min_rate numeric,
  max_rate numeric,
  processing_fee numeric,
  moratorium_months int,
  max_amount numeric,
  updated_at timestamp with time zone default now()
);

create table if not exists public.schemes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  provider text,
  max_amount numeric,
  income_limit numeric,
  category text[],
  states text[],
  deadline date,
  apply_url text
);

create table if not exists public.alert_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  phone text,
  college_id uuid references public.colleges(id) on delete cascade,
  course text not null,
  notify_via text[] not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.ai_chat_logs (
  id uuid primary key default uuid_generate_v4(),
  session_id text,
  college_id uuid,
  user_message text not null,
  ai_response text not null,
  created_at timestamp with time zone default now()
);

