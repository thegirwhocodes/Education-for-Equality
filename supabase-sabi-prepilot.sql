-- Sabi 10-child pre-pilot operations schema
-- Run this after supabase-sabi-schema.sql, supabase-sabi-v2.sql, and
-- supabase-sabi-telephony.sql.
--
-- Purpose:
--   - track the 10 children in the pre-pilot cohort
--   - record caregiver consent / child assent / onboarding status
--   - connect each child to the phone-memory student row used by Sabi
--   - review calls for audio quality, child engagement, learning signal, and safety
--   - keep operational alerts and follow-up tasks visible before scale
--
-- These tables are intentionally service-role/admin only. Do not expose them
-- through public Supabase anon policies; they contain child and caregiver PII.

-- Phone call session columns used by the PBX/AudioSocket path and dashboard.
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS call_sid TEXT;
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'web';
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_sabi_sessions_phone_number
  ON sabi_sessions(phone_number, created_at DESC)
  WHERE phone_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sabi_sessions_call_sid
  ON sabi_sessions(call_sid)
  WHERE call_sid IS NOT NULL;

-- Cohorts let us keep the 10-child pre-pilot separate from later pilots.
CREATE TABLE IF NOT EXISTS sabi_prepilot_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'setup'
    CHECK (status IN ('setup', 'recruiting', 'active', 'paused', 'completed')),
  target_child_count INTEGER NOT NULL DEFAULT 10,
  target_start_date DATE,
  target_end_date DATE,
  operator_owner TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO sabi_prepilot_cohorts (
  name,
  status,
  target_child_count,
  operator_owner,
  notes
)
VALUES (
  'Sabi 10-child pre-pilot',
  'setup',
  10,
  'Naomi Ivie',
  'Concierge pre-pilot: validate phone UX, learning signal, safety workflow, and repeat-use before a larger Lagos pilot.'
)
ON CONFLICT (name) DO NOTHING;

-- One row per child/caregiver phone relationship.
CREATE TABLE IF NOT EXISTS sabi_prepilot_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES sabi_prepilot_cohorts(id) ON DELETE CASCADE,
  student_id UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  child_code TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL,
  caregiver_name TEXT,
  caregiver_phone TEXT,
  age_years INTEGER CHECK (age_years IS NULL OR age_years BETWEEN 4 AND 18),
  network TEXT,
  location_label TEXT,
  language_profile TEXT,
  preferred_call_window TEXT,
  consent_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (consent_status IN ('not_started', 'sent', 'verbal_ok', 'written_ok', 'declined')),
  assent_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (assent_status IN ('not_started', 'verbal_ok', 'declined')),
  onboarding_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (onboarding_status IN ('not_started', 'scheduled', 'done', 'blocked')),
  baseline_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (baseline_status IN ('not_started', 'scheduled', 'done', 'blocked')),
  endline_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (endline_status IN ('not_started', 'scheduled', 'done', 'blocked')),
  risk_level TEXT NOT NULL DEFAULT 'low'
    CHECK (risk_level IN ('low', 'watch', 'high')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_prepilot_participants_cohort
  ON sabi_prepilot_participants(cohort_id, child_code);

CREATE INDEX IF NOT EXISTS idx_sabi_prepilot_participants_student
  ON sabi_prepilot_participants(student_id)
  WHERE student_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sabi_prepilot_participants_phone
  ON sabi_prepilot_participants(phone_number);

-- Human review of real calls. This is deliberately separate from automatic
-- Sabi scoring: the pre-pilot is about discovering failure modes, not hiding
-- them behind a single score.
CREATE TABLE IF NOT EXISTS sabi_prepilot_call_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES sabi_prepilot_participants(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sabi_sessions(id) ON DELETE SET NULL,
  call_sid TEXT,
  call_started_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  connection_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (connection_status IN ('unknown', 'connected', 'no_answer', 'dropped', 'carrier_issue', 'audio_failed')),
  lesson_status TEXT NOT NULL DEFAULT 'unknown'
    CHECK (lesson_status IN ('unknown', 'completed', 'partial', 'abandoned', 'not_learning')),
  transcript_quality INTEGER CHECK (transcript_quality IS NULL OR transcript_quality BETWEEN 0 AND 3),
  audio_quality INTEGER CHECK (audio_quality IS NULL OR audio_quality BETWEEN 0 AND 3),
  child_engagement INTEGER CHECK (child_engagement IS NULL OR child_engagement BETWEEN 0 AND 3),
  learning_signal INTEGER CHECK (learning_signal IS NULL OR learning_signal BETWEEN 0 AND 3),
  safety_flag BOOLEAN NOT NULL DEFAULT FALSE,
  follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_by TEXT,
  operator_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_prepilot_reviews_participant
  ON sabi_prepilot_call_reviews(participant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sabi_prepilot_reviews_session
  ON sabi_prepilot_call_reviews(session_id)
  WHERE session_id IS NOT NULL;

-- Incidents, follow-ups, and operator tasks.
CREATE TABLE IF NOT EXISTS sabi_prepilot_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES sabi_prepilot_participants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'operator_note'
    CHECK (event_type IN (
      'operator_note',
      'caregiver_follow_up',
      'technical_issue',
      'safety_concern',
      'learning_concern',
      'consent_issue',
      'call_scheduling'
    )),
  severity TEXT NOT NULL DEFAULT 'info'
    CHECK (severity IN ('info', 'watch', 'urgent')),
  title TEXT NOT NULL,
  details TEXT,
  owner TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'waiting', 'resolved')),
  due_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_prepilot_events_participant
  ON sabi_prepilot_events(participant_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sabi_prepilot_events_status
  ON sabi_prepilot_events(status, severity, due_at);

-- Updated-at helper for this migration.
CREATE OR REPLACE FUNCTION set_sabi_prepilot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_sabi_prepilot_cohorts_updated_at ON sabi_prepilot_cohorts;
CREATE TRIGGER set_sabi_prepilot_cohorts_updated_at
  BEFORE UPDATE ON sabi_prepilot_cohorts
  FOR EACH ROW
  EXECUTE FUNCTION set_sabi_prepilot_updated_at();

DROP TRIGGER IF EXISTS set_sabi_prepilot_participants_updated_at ON sabi_prepilot_participants;
CREATE TRIGGER set_sabi_prepilot_participants_updated_at
  BEFORE UPDATE ON sabi_prepilot_participants
  FOR EACH ROW
  EXECUTE FUNCTION set_sabi_prepilot_updated_at();

DROP TRIGGER IF EXISTS set_sabi_prepilot_reviews_updated_at ON sabi_prepilot_call_reviews;
CREATE TRIGGER set_sabi_prepilot_reviews_updated_at
  BEFORE UPDATE ON sabi_prepilot_call_reviews
  FOR EACH ROW
  EXECUTE FUNCTION set_sabi_prepilot_updated_at();

DROP TRIGGER IF EXISTS set_sabi_prepilot_events_updated_at ON sabi_prepilot_events;
CREATE TRIGGER set_sabi_prepilot_events_updated_at
  BEFORE UPDATE ON sabi_prepilot_events
  FOR EACH ROW
  EXECUTE FUNCTION set_sabi_prepilot_updated_at();

ALTER TABLE sabi_prepilot_cohorts DISABLE ROW LEVEL SECURITY;
ALTER TABLE sabi_prepilot_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE sabi_prepilot_call_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE sabi_prepilot_events DISABLE ROW LEVEL SECURITY;

SELECT 'sabi pre-pilot operations schema ready' AS status;
