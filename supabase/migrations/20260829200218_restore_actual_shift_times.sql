alter table public.shifts
  add column if not exists actual_started_at timestamptz,
  add column if not exists actual_ended_at timestamptz;