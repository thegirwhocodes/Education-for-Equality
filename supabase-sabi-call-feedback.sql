-- Sabi optional end-of-call feedback
-- Run after the core Sabi schema and telephony/learning-state migrations.
--
-- Purpose:
--   - store optional tester/caregiver/child feedback notes separately from
--     lesson transcripts
--   - preserve call metadata for debugging UX, STT, TTS, latency, network, and
--     curriculum issues
--   - keep child voice feedback behind explicit opt-in / consent controls

CREATE TABLE IF NOT EXISTS sabi_call_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  phone_number TEXT,
  call_sid TEXT,
  channel TEXT NOT NULL DEFAULT 'asterisk_audiosocket',
  participant_type TEXT NOT NULL DEFAULT 'tester'
    CHECK (participant_type IN ('tester', 'adult_tester', 'caregiver', 'child', 'operator')),
  consent_recorded BOOLEAN NOT NULL DEFAULT FALSE,
  assent_recorded BOOLEAN NOT NULL DEFAULT FALSE,
  recording_path TEXT,
  transcript TEXT,
  redacted_transcript TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  duration_seconds INTEGER,
  network TEXT,
  review_status TEXT NOT NULL DEFAULT 'new'
    CHECK (review_status IN ('new', 'reviewed', 'actioned', 'ignored')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sabi_call_feedback_call_sid
  ON sabi_call_feedback(call_sid)
  WHERE call_sid IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sabi_call_feedback_student_created
  ON sabi_call_feedback(student_id, created_at DESC)
  WHERE student_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sabi_call_feedback_status_created
  ON sabi_call_feedback(review_status, created_at DESC);

CREATE OR REPLACE FUNCTION set_sabi_call_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_sabi_call_feedback_updated_at ON sabi_call_feedback;
CREATE TRIGGER set_sabi_call_feedback_updated_at
  BEFORE UPDATE ON sabi_call_feedback
  FOR EACH ROW
  EXECUTE FUNCTION set_sabi_call_feedback_updated_at();

ALTER TABLE sabi_call_feedback ENABLE ROW LEVEL SECURITY;

SELECT 'sabi call feedback schema ready' AS status;
