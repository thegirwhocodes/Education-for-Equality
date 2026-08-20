-- Adult tester sign-ups for the Sabi calling rounds.
--
-- The public page at /sabi/test writes here through the service role only, so
-- the table stays closed to the anon key: a volunteer's name, phone number and
-- email are personal data and nothing on the client should read the list back.

create table if not exists public.sabi_tester_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_number text not null,
  email text,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per number: re-submitting updates the details rather than creating a
-- duplicate the scheduler would call twice.
create unique index if not exists sabi_tester_signups_phone_key
  on public.sabi_tester_signups (phone_number);

alter table public.sabi_tester_signups enable row level security;

-- No anon/authenticated policies on purpose. RLS with zero policies denies all
-- access; the service role bypasses RLS and is the only writer/reader.
