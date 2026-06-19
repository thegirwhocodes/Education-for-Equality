-- Sabi Safeguarding Incident Queue
-- =================================
-- The async "no real-time human" escalation path. When the guardrail layer
-- detects a CRITICAL disclosure (abuse / self-harm / emergency) or a grooming
-- signal, an incident is written here for a NAMED human safeguarding focal point
-- to review on a defined SLA (see "7. Legal & IP/CHILD_PROTECTION_POLICY.md").
--
-- Restricted by design: Row Level Security denies all anon/authenticated access.
-- Only the service role (the Sabi server) writes; the focal point reads via a
-- restricted, audited path (Supabase dashboard with a dedicated role, or a
-- minimal internal admin view — NOT the public app).
--
-- Run in the Supabase SQL editor.

create table if not exists public.safeguarding_incidents (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  student_id          text,                       -- pseudonymous student key (phone-hash), nullable
  category            text not null,              -- e.g. abuse_disclosure | self_harm | emergency | grooming_meetup
  risk_level          smallint not null check (risk_level between 0 and 3),
  reason              text not null,              -- guard reason code (never spoken)
  utterance_redacted  text,                       -- the disclosure, with contact-PII masked
  channel             text,                       -- at | twilio | web
  call_id             text,
  status              text not null default 'open'  -- open | reviewing | actioned | closed
                       check (status in ('open','reviewing','actioned','closed')),
  reviewed_by         text,                       -- focal point identifier (set on review)
  reviewed_at         timestamptz,
  action_notes        text
);

create index if not exists safeguarding_incidents_open_idx
  on public.safeguarding_incidents (status, risk_level desc, created_at desc);

-- Lock it down. No anon/authenticated access at all; service role bypasses RLS.
alter table public.safeguarding_incidents enable row level security;
-- (Intentionally NO policies for anon/authenticated => default deny.)

comment on table public.safeguarding_incidents is
  'CRITICAL child-safeguarding incidents from the Sabi guardrail layer. Restricted: service-role write, focal-point read only. Minimise PII; honour data-retention policy.';
