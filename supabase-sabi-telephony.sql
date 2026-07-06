-- Sabi Telephony: call state, SMS log, phone-based students, audio storage
-- Idempotent migration. Run in Supabase Dashboard > SQL Editor.
--
-- Recreates the 3 DB objects (+ 1 storage bucket) the voice code depends on
-- but that were never committed to a SQL file:
--   - table  sabi_active_calls   (lib/voice/call-state.ts)
--   - table  sabi_sms_log        (lib/voice/sms.ts)
--   - column sabi_students.phone_number  (lib/voice/sabi-shared.ts)
--   - bucket sabi-audio (PUBLIC)          (lib/voice/audio-storage.ts)
--
-- All Sabi tables are touched server-side only with SUPABASE_SERVICE_ROLE_KEY
-- (bypasses RLS), matching supabase-lesson-completions.sql — so RLS is disabled.

-- 1. sabi_students.phone_number (used by findOrCreateStudentByPhone)
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- findOrCreateStudentByPhone inserts a student with ONLY phone_number set, but
-- the original schema declared browser_id TEXT UNIQUE NOT NULL. Relax it so a
-- phone-only insert is valid (otherwise NOT NULL violation on a fresh project).
ALTER TABLE sabi_students ALTER COLUMN browser_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sabi_students_phone_number
  ON sabi_students(phone_number)
  WHERE phone_number IS NOT NULL;

-- 2. sabi_active_calls (per-call conversation state; serverless-safe store)
CREATE TABLE IF NOT EXISTS sabi_active_calls (
  call_sid     TEXT PRIMARY KEY,
  student_id   UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  phone_number TEXT,
  messages     JSONB NOT NULL DEFAULT '[]',
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_active_calls_updated_at
  ON sabi_active_calls(updated_at);

ALTER TABLE sabi_active_calls DISABLE ROW LEVEL SECURITY;

-- 3. sabi_sms_log (outbound/inbound SMS log + practice-answer tracking)
CREATE TABLE IF NOT EXISTS sabi_sms_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  phone_number    TEXT NOT NULL,
  direction       TEXT NOT NULL DEFAULT 'outbound',  -- 'outbound' | 'inbound'
  message         TEXT,
  sms_type        TEXT DEFAULT 'general',            -- 'general'|'summary'|'practice'|'reminder'|'reply'|'help'|'opt_in'|'opt_out'|'caregiver_*'
  channel         TEXT,                              -- 'at' | 'twilio' | 'unknown'
  expected_answer TEXT,
  actual_answer   TEXT,
  is_correct      BOOLEAN,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_sms_log_lookup
  ON sabi_sms_log(phone_number, sms_type, direction, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sabi_sms_log_student_id
  ON sabi_sms_log(student_id);

ALTER TABLE sabi_sms_log DISABLE ROW LEVEL SECURITY;

-- 4. sabi-audio storage bucket (PUBLIC; serves TTS audio to AT <Play>)
INSERT INTO storage.buckets (id, name, public)
VALUES ('sabi-audio', 'sabi-audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "sabi_audio_public_read" ON storage.objects;
CREATE POLICY "sabi_audio_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sabi-audio');

SELECT 'sabi telephony schema (calls, sms_log, phone_number, sabi-audio bucket) ready!' AS status;
