-- Sabi learning state + identity hardening
-- Run after supabase-sabi-schema.sql, supabase-sabi-v2.sql, and
-- supabase-sabi-telephony.sql.
--
-- Purpose:
--   - ensure stable phone lookup while allowing one learner row per child name
--     per phone number
--   - store baseline diagnostic and TaRL-style placement state
--   - persist scaffold depth / correct-wrong streaks so Sabi continues from
--     the exact pedagogical state on the next call

-- Stable phone identity. Existing rows may have +234..., 234..., or 080...
-- in phone_number; app/server code normalizes new writes into this column.
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS phone_number_normalized TEXT;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS phone_household_key TEXT;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS child_name_normalized TEXT;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS learner_key TEXT;

UPDATE sabi_students
SET phone_number_normalized = CASE
  WHEN phone_number IS NULL OR btrim(phone_number) = '' THEN NULL
  WHEN regexp_replace(phone_number, '\D', '', 'g') LIKE '0%' THEN
    '+234' || substring(regexp_replace(phone_number, '\D', '', 'g') from 2)
  ELSE
    '+' || regexp_replace(phone_number, '\D', '', 'g')
END
WHERE phone_number IS NOT NULL
  AND (phone_number_normalized IS NULL OR phone_number_normalized = '');

UPDATE sabi_students
SET
  phone_household_key = phone_number_normalized,
  child_name_normalized = NULLIF(
    regexp_replace(lower(coalesce(name, '')), '[^a-z0-9'' ]', ' ', 'g'),
    ''
  )
WHERE phone_number_normalized IS NOT NULL
  AND (phone_household_key IS NULL OR child_name_normalized IS NULL);

UPDATE sabi_students
SET learner_key = phone_number_normalized || '::' || regexp_replace(child_name_normalized, '\s+', ' ', 'g')
WHERE phone_number_normalized IS NOT NULL
  AND child_name_normalized IS NOT NULL
  AND learner_key IS NULL;

DROP INDEX IF EXISTS idx_sabi_students_phone_number_normalized;

CREATE INDEX IF NOT EXISTS idx_sabi_students_phone_number_normalized
  ON sabi_students(phone_number_normalized)
  WHERE phone_number_normalized IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sabi_students_learner_key
  ON sabi_students(learner_key)
  WHERE learner_key IS NOT NULL;

-- Core adaptive placement fields.
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS current_week INTEGER DEFAULT 1;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS current_lesson INTEGER DEFAULT 1;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS tarl_level INTEGER DEFAULT 0;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_status TEXT NOT NULL DEFAULT 'not_started'
  CHECK (baseline_status IN ('not_started', 'in_progress', 'done', 'blocked'));
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS diagnostic_results JSONB DEFAULT '{}';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS learning_state JSONB DEFAULT '{}';

-- Keep existing v2 fields present on older DBs.
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS current_module INTEGER DEFAULT 0;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS current_topic TEXT DEFAULT 'diagnostic';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '{}';

UPDATE sabi_students
SET learning_state = jsonb_build_object(
  'course', 'numeracy',
  'phase', CASE WHEN COALESCE(current_module, 0) = 0 THEN 'diagnostic' ELSE 'teaching' END,
  'diagnostic_status', CASE WHEN COALESCE(current_module, 0) = 0 THEN 'not_started' ELSE 'done' END,
  'current_module', COALESCE(current_module, 0),
  'current_week', COALESCE(current_week, 1),
  'current_lesson', COALESCE(current_lesson, 1),
  'tarl_level', COALESCE(tarl_level, 0),
  'active_skill', COALESCE(current_topic, 'diagnostic'),
  'correct_streak', 0,
  'wrong_streak', 0,
  'scaffold_depth', 0,
  'next_step', CASE
    WHEN COALESCE(current_module, 0) = 0
      THEN 'Run a warm diagnostic disguised as a game, then start the first mini-lesson at the placed level.'
    ELSE 'Start with recall, then continue the current lesson with guided practice and an independent check.'
  END,
  'updated_at', NOW()
)
WHERE learning_state IS NULL OR learning_state = '{}'::jsonb;

-- Session audit columns for placement evidence.
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS call_sid TEXT;
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'web';
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS topics_covered TEXT[] DEFAULT '{}';
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS recommended_module INTEGER;

CREATE INDEX IF NOT EXISTS idx_sabi_sessions_student_created
  ON sabi_sessions(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sabi_sessions_phone_created
  ON sabi_sessions(phone_number, created_at DESC)
  WHERE phone_number IS NOT NULL;

SELECT 'sabi learning-state schema ready' AS status;
