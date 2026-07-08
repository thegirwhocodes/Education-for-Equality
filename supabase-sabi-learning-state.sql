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
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_tarl_level INTEGER;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_reading_level INTEGER;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_recorded_at TIMESTAMPTZ;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_probe_score NUMERIC;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_probe_at TIMESTAMPTZ;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_probe_source TEXT;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS latest_probe_score NUMERIC;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS latest_probe_at TIMESTAMPTZ;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS probe_history JSONB DEFAULT '[]';

-- Publishable-grade evidence spine: J-PAL-style protocol fields,
-- UNESCO/GPF-compatible outcomes, TEP/LEARNigeria assessment validity,
-- and TaRL placement/remediation/reassessment. The 10-child pre-pilot is
-- outward-facing methods/data-quality evidence; causal effect claims wait
-- for powered randomization.
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS study_stage TEXT DEFAULT 'ten_child_prepilot';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS study_arm TEXT DEFAULT 'measured_sabi_pre_pilot';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS research_state JSONB DEFAULT '{}';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS research_measurements JSONB DEFAULT '[]';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS assessment_events JSONB DEFAULT '[]';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS item_responses JSONB DEFAULT '[]';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS consent_state JSONB DEFAULT '{}';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS latest_assessment_phase TEXT;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS next_assessment_due TEXT DEFAULT 'pre_baseline';
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS baseline_assessment_at TIMESTAMPTZ;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS midline_assessment_at TIMESTAMPTZ;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS endline_assessment_at TIMESTAMPTZ;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS retention_assessment_at TIMESTAMPTZ;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Normalized publishable-grade evidence tables. The app also stores compact
-- JSON snapshots on sabi_students so older deployments can remain read-safe,
-- but these tables are the durable evaluator-facing source of truth.
CREATE TABLE IF NOT EXISTS research_protocols (
  protocol_id TEXT PRIMARY KEY,
  protocol_version TEXT NOT NULL,
  public_title TEXT NOT NULL,
  study_stage TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'board_locked', 'ethics_ready', 'registered', 'active', 'analysis_frozen', 'reported')),
  registry_type TEXT DEFAULT 'internal_pre_registration',
  registry_url TEXT,
  pap_url TEXT,
  irb_or_ethics_status TEXT DEFAULT 'not_submitted',
  external_evaluator TEXT,
  primary_outcomes JSONB NOT NULL DEFAULT '[]',
  secondary_outcomes JSONB NOT NULL DEFAULT '[]',
  measurement_benchmarks JSONB NOT NULL DEFAULT '[]',
  board_training JSONB NOT NULL DEFAULT '{}',
  sample_plan JSONB NOT NULL DEFAULT '{}',
  power_assumption TEXT,
  randomization_unit TEXT DEFAULT 'learner_household',
  clustering_unit TEXT DEFAULT 'phone_household',
  strata JSONB NOT NULL DEFAULT '[]',
  analysis_freeze_at TIMESTAMPTZ,
  created_by TEXT,
  locked_by TEXT,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  child_code TEXT,
  caregiver_phone_hash TEXT,
  caregiver_consent_recorded BOOLEAN NOT NULL DEFAULT FALSE,
  child_assent_recorded BOOLEAN NOT NULL DEFAULT FALSE,
  training_audio_consent_recorded BOOLEAN NOT NULL DEFAULT FALSE,
  consent_mode TEXT,
  language TEXT,
  collector TEXT,
  witness TEXT,
  withdrawn BOOLEAN NOT NULL DEFAULT FALSE,
  withdrawal_reason TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_instruments (
  instrument_id TEXT PRIMARY KEY,
  protocol_id TEXT REFERENCES research_protocols(protocol_id) ON DELETE SET NULL,
  subject TEXT NOT NULL CHECK (subject IN ('numeracy', 'literacy')),
  phase TEXT NOT NULL CHECK (phase IN ('pre_baseline', 'midline', 'post_endline', 'retention_followup')),
  form TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'voice_fixed_oral',
  version TEXT NOT NULL DEFAULT 'v01',
  construct_map JSONB NOT NULL DEFAULT '[]',
  framework_anchors JSONB NOT NULL DEFAULT '[]',
  reviewer_status TEXT NOT NULL DEFAULT 'internal_draft',
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_items (
  item_id TEXT PRIMARY KEY,
  instrument_id TEXT REFERENCES assessment_instruments(instrument_id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('numeracy', 'literacy')),
  phase TEXT NOT NULL CHECK (phase IN ('pre_baseline', 'midline', 'post_endline', 'retention_followup')),
  construct TEXT NOT NULL,
  subskill TEXT,
  tarl_level INTEGER,
  gpf_descriptor TEXT,
  egra_egma_relation TEXT,
  nerdc_cambridge_refs JSONB NOT NULL DEFAULT '[]',
  difficulty NUMERIC,
  language TEXT DEFAULT 'English',
  prompt TEXT NOT NULL,
  acceptable_answers JSONB NOT NULL DEFAULT '[]',
  scoring_rule TEXT NOT NULL,
  voice_only_claim_boundary TEXT,
  expected_stt_risks JSONB NOT NULL DEFAULT '[]',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_events (
  event_id TEXT PRIMARY KEY,
  protocol_id TEXT REFERENCES research_protocols(protocol_id) ON DELETE SET NULL,
  student_id UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  instrument_ids JSONB NOT NULL DEFAULT '[]',
  phase TEXT NOT NULL CHECK (phase IN ('pre_baseline', 'midline', 'post_endline', 'retention_followup')),
  assessment_mode TEXT NOT NULL DEFAULT 'voice_fixed_oral',
  administration_rule TEXT NOT NULL DEFAULT 'neutral_no_coaching_until_measured_response_is_frozen',
  call_sid TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  aggregate_probe_score NUMERIC,
  scoring_status TEXT DEFAULT 'aggregate_scored_item_level_pending',
  blinded_flag BOOLEAN DEFAULT FALSE,
  interruption_flag BOOLEAN DEFAULT FALSE,
  consent_snapshot JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS item_responses (
  response_id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES assessment_events(event_id) ON DELETE CASCADE,
  student_id UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  item_id TEXT REFERENCES assessment_items(item_id) ON DELETE SET NULL,
  instrument_id TEXT,
  phase TEXT NOT NULL,
  subject TEXT NOT NULL,
  construct TEXT,
  subskill TEXT,
  raw_transcript TEXT,
  normalized_transcript TEXT,
  score NUMERIC,
  aggregate_event_score NUMERIC,
  scorer TEXT,
  review_status TEXT DEFAULT 'pending_item_level_scoring',
  audio_pointer TEXT,
  scoring_rule TEXT,
  voice_only_claim_boundary TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rater_adjudications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id TEXT REFERENCES item_responses(response_id) ON DELETE CASCADE,
  scorer_1 TEXT,
  score_1 NUMERIC,
  scorer_2 TEXT,
  score_2 NUMERIC,
  adjudicator TEXT,
  final_score NUMERIC,
  agreement NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS randomization_batches (
  batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id TEXT REFERENCES research_protocols(protocol_id) ON DELETE SET NULL,
  seed TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by TEXT,
  strata JSONB NOT NULL DEFAULT '[]',
  unit TEXT DEFAULT 'learner_household',
  allocation_ratio JSONB NOT NULL DEFAULT '{}',
  algorithm TEXT NOT NULL DEFAULT 'blocked_hash_or_independent_assignment',
  code_hash TEXT,
  reviewer TEXT,
  sealed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS randomization_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES randomization_batches(batch_id) ON DELETE SET NULL,
  protocol_id TEXT REFERENCES research_protocols(protocol_id) ON DELETE SET NULL,
  student_id UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  household_key TEXT,
  stratum JSONB NOT NULL DEFAULT '{}',
  arm TEXT NOT NULL,
  assignment_version TEXT,
  sealed_at TIMESTAMPTZ,
  revealed_at TIMESTAMPTZ,
  deviation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attrition_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id TEXT REFERENCES research_protocols(protocol_id) ON DELETE SET NULL,
  student_id UUID REFERENCES sabi_students(id) ON DELETE SET NULL,
  phase TEXT,
  reason TEXT CHECK (reason IN (
    'unreachable', 'caregiver_declined', 'child_unavailable', 'shared_phone_conflict',
    'network_failure', 'moved_location', 'safety_pause', 'unknown'
  )),
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_events_student_phase
  ON assessment_events(student_id, phase, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_item_responses_event
  ON item_responses(event_id);

CREATE INDEX IF NOT EXISTS idx_item_responses_review_status
  ON item_responses(review_status);

CREATE INDEX IF NOT EXISTS idx_consent_records_student
  ON consent_records(student_id, recorded_at DESC);

INSERT INTO research_protocols (
  protocol_id, protocol_version, public_title, study_stage, status,
  registry_type, irb_or_ethics_status, primary_outcomes, secondary_outcomes,
  measurement_benchmarks, board_training,
  sample_plan, power_assumption, randomization_unit, clustering_unit, strata
) VALUES (
  'sabi-publishable-evidence-001',
  'sabi-tep-tarl-rct-v0.1',
  'Sabi phone-based foundational literacy and numeracy pilot evidence protocol',
  'ten_child_prepilot',
  'draft',
  'internal_pre_registration',
  'not_submitted',
  '[
    {"key":"numeracy_tarl_level_movement","label":"Numeracy TaRL level movement","construct":"foundational numeracy placement and advancement"},
    {"key":"literacy_oral_readiness_level_movement","label":"Literacy/oral-readiness TaRL level movement","construct":"phonological awareness, oral comprehension, and print-bridge readiness"},
    {"key":"fixed_probe_gain","label":"Fixed-probe gain","construct":"phase-comparable oral literacy and numeracy mastery"}
  ]'::jsonb,
  '["skills_mastered","second_call_return","dosage_minutes","scaffold_depth_and_rejoin_success","retention_followup","cost_per_level_gain"]'::jsonb,
  '[
    {"source":"J-PAL / AEA","standard":"Protocol registration, PAP, randomization metadata, balance/attrition tracking, reproducible exports."},
    {"source":"UNESCO UIS / GPF","standard":"Learning outcomes map to minimum proficiency in reading and mathematics with clear reporting language."},
    {"source":"TEP / LEARNigeria","standard":"Nigerian foundational literacy/numeracy assessment is child-level, empirical, locally valid, and action-oriented."},
    {"source":"TaRL","standard":"Assess actual level, teach at that level, remediate prerequisites, and reassess progress."},
    {"source":"EGRA / EGMA","standard":"Oral one-on-one items have constructs, administration rules, scoring rules, adaptation notes, and rater review."}
  ]'::jsonb,
  '{"title":"Sabi Evidence Delivery Training","rule":"Consent first, neutral fixed probes, no coaching inside measured items, TaRL remediation after the measured response is frozen, and honest claim tiers."}'::jsonb,
  '{"target_n":10,"current_stage":"10-child pre-pilot","next_stage":"thirty_child_micro_rct","partner_api":"/admin/evidence-protocol-kit","export_modes":["board","evaluator","public"],"claim_ladder":["10-child pre-pilot: methods/feasibility/data-quality/learning-signal only","30-child micro-randomization: feasibility/variance/adherence only","300-child controlled pilot: pre-specified treatment-control estimates if powered"]}'::jsonb,
  'Effect-size claims remain descriptive until the controlled pilot is powered; planning target is d>=0.30 with attrition sensitivity.',
  'learner_household',
  'phone_household',
  '["baseline_numeracy_level","baseline_literacy_level","phone_household","network"]'::jsonb
) ON CONFLICT (protocol_id) DO UPDATE SET
  protocol_version = EXCLUDED.protocol_version,
  primary_outcomes = EXCLUDED.primary_outcomes,
  secondary_outcomes = EXCLUDED.secondary_outcomes,
  measurement_benchmarks = EXCLUDED.measurement_benchmarks,
  board_training = EXCLUDED.board_training,
  sample_plan = EXCLUDED.sample_plan,
  updated_at = NOW();

INSERT INTO assessment_instruments (
  instrument_id, protocol_id, subject, phase, form, mode, version,
  construct_map, framework_anchors, reviewer_status
) VALUES
  ('sabi-num-pre-v01','sabi-publishable-evidence-001','numeracy','pre_baseline','A','voice_fixed_oral','v01','["number_recognition","quantity","single_digit_addition"]'::jsonb,'["TaRL numeracy placement","EGMA-inspired oral numeracy","UNESCO/GPF mathematics"]'::jsonb,'internal_draft'),
  ('sabi-lit-pre-v01','sabi-publishable-evidence-001','literacy','pre_baseline','A','voice_fixed_oral','v01','["listening_comprehension","beginning_sounds","phonological_awareness"]'::jsonb,'["TaRL reading-readiness placement","EGRA-inspired oral literacy","TEP/LEARNigeria FLN"]'::jsonb,'internal_draft'),
  ('sabi-num-mid-v01','sabi-publishable-evidence-001','numeracy','midline','B','voice_fixed_oral','v01','["number_operations","word_problem_listening","place_value_readiness"]'::jsonb,'["TaRL progress check","EGMA-inspired oral numeracy"]'::jsonb,'internal_draft'),
  ('sabi-lit-mid-v01','sabi-publishable-evidence-001','literacy','midline','B','voice_fixed_oral','v01','["sound_discrimination","oral_vocabulary","story_recall"]'::jsonb,'["TaRL progress check","EGRA-inspired oral literacy"]'::jsonb,'internal_draft'),
  ('sabi-num-post-v01','sabi-publishable-evidence-001','numeracy','post_endline','C','voice_fixed_oral','v01','["number_operations","word_problem_listening","mastery_transfer"]'::jsonb,'["TaRL reassessment","UNESCO/GPF mathematics"]'::jsonb,'internal_draft'),
  ('sabi-lit-post-v01','sabi-publishable-evidence-001','literacy','post_endline','C','voice_fixed_oral','v01','["phonological_awareness","oral_comprehension","print_bridge_readiness"]'::jsonb,'["TaRL reassessment","EGRA-inspired oral literacy"]'::jsonb,'internal_draft'),
  ('sabi-num-ret-v01','sabi-publishable-evidence-001','numeracy','retention_followup','R','voice_fixed_oral','v01','["delayed_recall","maintenance"]'::jsonb,'["retention check","TaRL progress tracking"]'::jsonb,'internal_draft'),
  ('sabi-lit-ret-v01','sabi-publishable-evidence-001','literacy','retention_followup','R','voice_fixed_oral','v01','["delayed_recall","oral_story_memory"]'::jsonb,'["retention check","EGRA-inspired oral literacy"]'::jsonb,'internal_draft')
ON CONFLICT (instrument_id) DO UPDATE SET
  construct_map = EXCLUDED.construct_map,
  framework_anchors = EXCLUDED.framework_anchors,
  updated_at = NOW();

INSERT INTO assessment_items (
  item_id, instrument_id, subject, phase, construct, subskill, tarl_level,
  gpf_descriptor, prompt, acceptable_answers, scoring_rule,
  voice_only_claim_boundary, expected_stt_risks
) VALUES
  ('num-pre-001','sabi-num-pre-v01','numeracy','pre_baseline','number_recognition','recognize spoken numbers 1-20',0,'counts and identifies small whole numbers','I will say a number. Say the number after me: seven.','["7","seven"]'::jsonb,'1 if child repeats or identifies seven without hint; 0 otherwise.','oral number recognition only; not written numeral reading','["accent variation","background noise","short utterance"]'::jsonb),
  ('num-pre-002','sabi-num-pre-v01','numeracy','pre_baseline','single_digit_addition','add within ten',1,'solves simple addition with small whole numbers','No hints for this one: what is two plus three?','["5","five"]'::jsonb,'1 if five is given before any teaching; 0 otherwise.','mental/oral addition; not written computation','["five/fine confusion","self-correction"]'::jsonb),
  ('lit-pre-001','sabi-lit-pre-v01','literacy','pre_baseline','beginning_sounds','identify initial sound',0,'recognizes sounds in spoken words','What sound do you hear at the beginning of mama?','["m","mmm","mu","em"]'::jsonb,'1 if /m/ sound is identified; 0 otherwise.','phonological awareness; not print decoding','["single-sound transcription","Pidgin/English code switch"]'::jsonb),
  ('lit-pre-002','sabi-lit-pre-v01','literacy','pre_baseline','listening_comprehension','recall one story fact',1,'understands simple oral sentences','Listen: Ada has one red bag. What colour is Ada''s bag?','["red"]'::jsonb,'1 if red is answered without hint; 0 otherwise.','oral comprehension; not reading comprehension','["low-volume answer","colour word accent"]'::jsonb),
  ('num-mid-001','sabi-num-mid-v01','numeracy','midline','word_problem_listening','addition story problem',1,'uses addition to solve a simple contextual problem','No help yet: you have four mangoes and get two more. How many mangoes now?','["6","six"]'::jsonb,'1 if six is answered before teaching; 0 otherwise.','oral word-problem reasoning','["six/sick confusion","long pause"]'::jsonb),
  ('lit-mid-001','sabi-lit-mid-v01','literacy','midline','story_recall','recall key event',1,'recalls information from a short oral text','Listen: Tunde fed the goat before school. Who did Tunde feed?','["goat","the goat"]'::jsonb,'1 if goat is answered without hint; 0 otherwise.','oral recall; not written reading','["goat/got confusion","background speech"]'::jsonb),
  ('num-post-001','sabi-num-post-v01','numeracy','post_endline','mastery_transfer','subtraction story problem',2,'solves simple subtraction in context','No help yet: you had nine sweets and gave away three. How many are left?','["6","six"]'::jsonb,'1 if six is answered before any scaffold; 0 otherwise.','oral subtraction and transfer','["six/sick confusion","child repeats whole story"]'::jsonb),
  ('lit-post-001','sabi-lit-post-v01','literacy','post_endline','oral_comprehension','infer simple action',2,'understands a short oral text and answers a direct question','Listen: Amina was thirsty, so she picked up a cup. What does Amina want to do?','["drink","drink water","water"]'::jsonb,'1 if drinking/water is answered without hint; 0 otherwise.','oral comprehension and inference','["multiword answer variation","quiet child"]'::jsonb)
ON CONFLICT (item_id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  acceptable_answers = EXCLUDED.acceptable_answers,
  scoring_rule = EXCLUDED.scoring_rule,
  voice_only_claim_boundary = EXCLUDED.voice_only_claim_boundary,
  expected_stt_risks = EXCLUDED.expected_stt_risks,
  updated_at = NOW();

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
ALTER TABLE sabi_sessions ADD COLUMN IF NOT EXISTS teacher_note JSONB;
ALTER TABLE sabi_students ADD COLUMN IF NOT EXISTS last_teacher_note JSONB;

CREATE INDEX IF NOT EXISTS idx_sabi_sessions_student_created
  ON sabi_sessions(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sabi_sessions_phone_created
  ON sabi_sessions(phone_number, created_at DESC)
  WHERE phone_number IS NOT NULL;

SELECT 'sabi learning-state schema ready' AS status;
