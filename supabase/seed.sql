-- Seed data for hackathon demo (LoanClarity)

-- Colleges
insert into public.colleges (id, name, nirf_rank, state, type, website, updated_at)
values
  ('11111111-1111-1111-1111-111111111111','IIT Bombay',3,'Maharashtra','IIT','https://www.iitb.ac.in/', now()),
  ('22222222-2222-2222-2222-222222222222','NIT Trichy',9,'Tamil Nadu','NIT','https://www.nitt.edu/', now()),
  ('33333333-3333-3333-3333-333333333333','BITS Pilani',null,'Rajasthan','Private','https://www.bits-pilani.ac.in/', now()),
  ('44444444-4444-4444-4444-444444444444','VIT Vellore',null,'Tamil Nadu','Private','https://vit.ac.in/', now()),
  ('55555555-5555-5555-5555-555555555555','Delhi College of Engineering',null,'Delhi','Govt',null, now())
on conflict (id) do update set
  name = excluded.name,
  nirf_rank = excluded.nirf_rank,
  state = excluded.state,
  type = excluded.type,
  website = excluded.website,
  updated_at = now();

-- Course fees (sample numbers for demo only)
-- IIT Bombay — B.Tech CSE
insert into public.course_fees (college_id, course, year, tuition_fee, hostel_fee, exam_fee, misc_fee, source, updated_at)
values
  ('11111111-1111-1111-1111-111111111111','B.Tech CSE',1,250000,120000,5000,15000,'Manual',now()),
  ('11111111-1111-1111-1111-111111111111','B.Tech CSE',2,230000,120000,5000,15000,'Manual',now()),
  ('11111111-1111-1111-1111-111111111111','B.Tech CSE',3,230000,120000,5000,15000,'Manual',now()),
  ('11111111-1111-1111-1111-111111111111','B.Tech CSE',4,230000,120000,5000,15000,'Manual',now())
on conflict do nothing;

-- NIT Trichy — B.Tech ECE
insert into public.course_fees (college_id, course, year, tuition_fee, hostel_fee, exam_fee, misc_fee, source, updated_at)
values
  ('22222222-2222-2222-2222-222222222222','B.Tech ECE',1,180000,90000,5000,12000,'Manual',now()),
  ('22222222-2222-2222-2222-222222222222','B.Tech ECE',2,165000,90000,5000,12000,'Manual',now()),
  ('22222222-2222-2222-2222-222222222222','B.Tech ECE',3,165000,90000,5000,12000,'Manual',now()),
  ('22222222-2222-2222-2222-222222222222','B.Tech ECE',4,165000,90000,5000,12000,'Manual',now())
on conflict do nothing;

-- BITS Pilani — B.Tech Mechanical
insert into public.course_fees (college_id, course, year, tuition_fee, hostel_fee, exam_fee, misc_fee, source, updated_at)
values
  ('33333333-3333-3333-3333-333333333333','B.Tech Mechanical',1,320000,140000,6000,18000,'Manual',now()),
  ('33333333-3333-3333-3333-333333333333','B.Tech Mechanical',2,320000,140000,6000,18000,'Manual',now()),
  ('33333333-3333-3333-3333-333333333333','B.Tech Mechanical',3,320000,140000,6000,18000,'Manual',now()),
  ('33333333-3333-3333-3333-333333333333','B.Tech Mechanical',4,320000,140000,6000,18000,'Manual',now())
on conflict do nothing;

-- VIT Vellore — B.Tech CSE
insert into public.course_fees (college_id, course, year, tuition_fee, hostel_fee, exam_fee, misc_fee, source, updated_at)
values
  ('44444444-4444-4444-4444-444444444444','B.Tech CSE',1,220000,110000,5000,14000,'Manual',now()),
  ('44444444-4444-4444-4444-444444444444','B.Tech CSE',2,220000,110000,5000,14000,'Manual',now()),
  ('44444444-4444-4444-4444-444444444444','B.Tech CSE',3,220000,110000,5000,14000,'Manual',now()),
  ('44444444-4444-4444-4444-444444444444','B.Tech CSE',4,220000,110000,5000,14000,'Manual',now())
on conflict do nothing;

-- Delhi College of Engineering — B.Tech Civil
insert into public.course_fees (college_id, course, year, tuition_fee, hostel_fee, exam_fee, misc_fee, source, updated_at)
values
  ('55555555-5555-5555-5555-555555555555','B.Tech Civil',1,140000,85000,4000,10000,'Manual',now()),
  ('55555555-5555-5555-5555-555555555555','B.Tech Civil',2,140000,85000,4000,10000,'Manual',now()),
  ('55555555-5555-5555-5555-555555555555','B.Tech Civil',3,140000,85000,4000,10000,'Manual',now()),
  ('55555555-5555-5555-5555-555555555555','B.Tech Civil',4,140000,85000,4000,10000,'Manual',now())
on conflict do nothing;

-- Banks
insert into public.bank_loan_rates (bank_name, min_rate, max_rate, processing_fee, moratorium_months, max_amount, updated_at)
values
  ('SBI Scholar Loan', 8.15, 10.5, 0, 12, 2000000, now()),
  ('Axis Bank Education Loan', 13.7, 15.2, 15000, 12, 4000000, now()),
  ('HDFC Credila', 11.0, 13.5, 10000, 12, 5000000, now()),
  ('Canara Bank Vidya Turant', 9.5, 11.0, 0, 12, 2000000, now()),
  ('Punjab National Bank', 8.65, 10.75, 0, 12, 2000000, now())
on conflict do nothing;

-- Schemes
insert into public.schemes (name, provider, max_amount, income_limit, category, states, deadline, apply_url)
values
  ('PM Vidyalakshmi', 'Central', 1000000, null, array['SC','ST','OBC','General'], array[]::text[], null, 'https://www.vidyalakshmi.co.in/'),
  ('Central Sector Scholarship', 'Central', 50000, 450000, array['SC','ST','OBC','General'], array[]::text[], null, 'https://scholarships.gov.in/'),
  ('SC/ST/OBC Post-Matric Scholarship (state-wise)', 'State', 100000, null, array['SC','ST','OBC'], array[]::text[], null, 'https://scholarships.gov.in/')
on conflict do nothing;

