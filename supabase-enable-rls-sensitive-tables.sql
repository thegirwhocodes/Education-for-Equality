-- Enable RLS on service-only Sabi, research, assessment, and pre-pilot tables.
--
-- These tables contain child/caregiver, call, research, assessment, or operator
-- data and should not be publicly readable through Supabase anon/authenticated
-- roles. Runtime app/server code accesses them with SUPABASE_SERVICE_ROLE_KEY,
-- which bypasses RLS.

ALTER TABLE IF EXISTS public.sabi_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sabi_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sabi_active_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sabi_sms_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sabi_call_feedback ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.sabi_prepilot_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sabi_prepilot_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sabi_prepilot_call_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sabi_prepilot_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.research_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessment_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.item_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rater_adjudications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.randomization_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.randomization_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attrition_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.lesson_completions ENABLE ROW LEVEL SECURITY;
