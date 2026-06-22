-- Sabi shared-phone learner identity migration
-- Run after the existing telephony/learning-state migrations.
--
-- Original product intent from the hackathon plan:
--   profile per child name per phone number.
-- This lets siblings share a parent phone while still resuming their own
-- lesson path. Phone-only indexes remain non-unique for lookup speed.

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
    lower(regexp_replace(coalesce(name, ''), '[^a-zA-Z0-9'' ]', ' ', 'g')),
    ''
  )
WHERE phone_number_normalized IS NOT NULL;

UPDATE sabi_students
SET
  child_name_normalized = NULLIF(regexp_replace(child_name_normalized, '\s+', ' ', 'g'), ''),
  learner_key = CASE
    WHEN phone_number_normalized IS NOT NULL
      AND NULLIF(regexp_replace(coalesce(child_name_normalized, ''), '\s+', ' ', 'g'), '') IS NOT NULL
      THEN phone_number_normalized || '::' || NULLIF(regexp_replace(child_name_normalized, '\s+', ' ', 'g'), '')
    ELSE learner_key
  END;

-- These older indexes enforce one row per phone and block shared-family phones.
DROP INDEX IF EXISTS idx_sabi_students_phone;
DROP INDEX IF EXISTS idx_sabi_students_phone_number;
DROP INDEX IF EXISTS idx_sabi_students_phone_number_normalized;

CREATE INDEX IF NOT EXISTS idx_sabi_students_phone_number
  ON sabi_students(phone_number)
  WHERE phone_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sabi_students_phone_number_normalized
  ON sabi_students(phone_number_normalized)
  WHERE phone_number_normalized IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sabi_students_phone_household_key
  ON sabi_students(phone_household_key)
  WHERE phone_household_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sabi_students_learner_key
  ON sabi_students(learner_key)
  WHERE learner_key IS NOT NULL;

SELECT 'sabi shared-phone learner identity schema ready' AS status;
