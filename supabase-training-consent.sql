-- Sabi — training-consent gate (the two-track corpus boundary)
-- ============================================================
-- Consent B ("help improve Sabi") is SEPARATE from Consent A ("use the tutor").
-- Only children whose guardian gave Consent B may have their recordings/transcripts
-- enter the training corpus. This column is that gate.
--
-- Pipeline rule (enforce in any data-export / training job):
--   SELECT ... FROM sabi_students WHERE training_consent = true;
-- Everyone else: audio is transient and never persisted to the corpus.
--
-- Run in the Supabase SQL editor.

alter table public.sabi_students
  add column if not exists training_consent boolean not null default false,
  add column if not exists training_consent_at timestamptz,        -- when Consent B was given
  add column if not exists training_consent_source text;            -- e.g. 'enrolment-paper' | 'app'

comment on column public.sabi_students.training_consent is
  'COPPA/NDPA: TRUE only with separate guardian consent (Consent B) to use this child''s data to improve/train Sabi. Default FALSE. Corpus jobs MUST filter on this.';

-- Withdrawal: set training_consent=false and delete this student''s corpus rows.
