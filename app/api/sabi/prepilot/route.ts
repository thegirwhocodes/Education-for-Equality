import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type UpsertParticipantBody = {
  action: 'upsert_participant';
  participant: {
    id?: string;
    cohort_id?: string;
    child_code: string;
    display_name?: string;
    phone_number: string;
    caregiver_name?: string;
    caregiver_phone?: string;
    age_years?: number | null;
    network?: string;
    location_label?: string;
    language_profile?: string;
    preferred_call_window?: string;
    consent_status?: string;
    assent_status?: string;
    onboarding_status?: string;
    baseline_status?: string;
    endline_status?: string;
    risk_level?: string;
    notes?: string;
  };
};

type LogReviewBody = {
  action: 'log_review';
  review: {
    participant_id: string;
    session_id?: string | null;
    call_sid?: string | null;
    call_started_at?: string | null;
    duration_seconds?: number | null;
    connection_status?: string;
    lesson_status?: string;
    transcript_quality?: number | null;
    audio_quality?: number | null;
    child_engagement?: number | null;
    learning_signal?: number | null;
    safety_flag?: boolean;
    follow_up_required?: boolean;
    reviewed_by?: string;
    operator_notes?: string;
  };
};

type LogEventBody = {
  action: 'log_event';
  event: {
    participant_id?: string | null;
    event_type?: string;
    severity?: string;
    title: string;
    details?: string;
    owner?: string;
    status?: string;
    due_at?: string | null;
  };
};

type UpdateEventBody = {
  action: 'update_event';
  event_id: string;
  patch: {
    status?: string;
    severity?: string;
    owner?: string;
    details?: string;
    resolved_at?: string | null;
  };
};

type RequestBody = UpsertParticipantBody | LogReviewBody | LogEventBody | UpdateEventBody;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

function normalizePhone(phone: string) {
  return (phone || '').replace(/[^\d+]/g, '');
}

async function getActiveCohort(supabase: ReturnType<typeof getSupabase>, cohortId?: string) {
  if (cohortId) {
    const { data, error } = await supabase
      .from('sabi_prepilot_cohorts')
      .select('*')
      .eq('id', cohortId)
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('sabi_prepilot_cohorts')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

async function findOrCreateStudent(
  supabase: ReturnType<typeof getSupabase>,
  phoneNumber: string,
  name?: string,
) {
  const normalizedPhone = normalizePhone(phoneNumber);
  const { data: existing } = await supabase
    .from('sabi_students')
    .select('*')
    .eq('phone_number', normalizedPhone)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('sabi_students')
    .insert({
      phone_number: normalizedPhone,
      name: name || null,
      current_level: 'beginner',
      current_module: 0,
      current_topic: 'diagnostic',
      total_sessions: 0,
      total_correct: 0,
      total_wrong: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function GET() {
  const supabase = getSupabase();

  const { data: cohorts, error: cohortsError } = await supabase
    .from('sabi_prepilot_cohorts')
    .select('*')
    .order('created_at', { ascending: true });

  if (cohortsError) {
    return jsonResponse({
      setupNeeded: true,
      setupError: cohortsError.message,
      cohorts: [],
      activeCohort: null,
      participants: [],
      sessions: [],
      reviews: [],
      events: [],
    });
  }

  const activeCohort = cohorts?.[0] || null;
  if (!activeCohort) {
    return jsonResponse({
      cohorts: [],
      activeCohort: null,
      participants: [],
      sessions: [],
      reviews: [],
      events: [],
    });
  }

  const { data: participants, error: participantsError } = await supabase
    .from('sabi_prepilot_participants')
    .select('*')
    .eq('cohort_id', activeCohort.id)
    .order('child_code', { ascending: true });

  if (participantsError) {
    return jsonResponse({ error: participantsError.message }, 500);
  }

  const participantIds = (participants || []).map((participant) => participant.id);
  const studentIds = (participants || [])
    .map((participant) => participant.student_id)
    .filter(Boolean);
  const phones = new Set((participants || []).map((participant) => participant.phone_number).filter(Boolean));

  const { data: sessions, error: sessionsError } = await supabase
    .from('sabi_sessions')
    .select(
      'id, student_id, messages, summary, correct_count, wrong_count, duration_seconds, topics_covered, recommended_module, phone_number, call_sid, channel, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(250);

  if (sessionsError) {
    return jsonResponse({ error: sessionsError.message }, 500);
  }

  const filteredSessions = (sessions || []).filter((session) => {
    const studentMatch = session.student_id && studentIds.includes(session.student_id);
    const phoneMatch = session.phone_number && phones.has(session.phone_number);
    return studentMatch || phoneMatch;
  });

  const reviewsQuery = supabase
    .from('sabi_prepilot_call_reviews')
    .select('*')
    .order('created_at', { ascending: false });
  const eventsQuery = supabase
    .from('sabi_prepilot_events')
    .select('*')
    .order('created_at', { ascending: false });

  const [{ data: reviews, error: reviewsError }, { data: events, error: eventsError }] =
    await Promise.all([
      participantIds.length ? reviewsQuery.in('participant_id', participantIds) : reviewsQuery.limit(0),
      participantIds.length ? eventsQuery.in('participant_id', participantIds) : eventsQuery.limit(0),
    ]);

  if (reviewsError) return jsonResponse({ error: reviewsError.message }, 500);
  if (eventsError) return jsonResponse({ error: eventsError.message }, 500);

  return jsonResponse({
    cohorts: cohorts || [],
    activeCohort,
    participants: participants || [],
    sessions: filteredSessions,
    reviews: reviews || [],
    events: events || [],
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestBody;
  const supabase = getSupabase();

  try {
    if (body.action === 'upsert_participant') {
      const participant = body.participant;
      const phoneNumber = normalizePhone(participant.phone_number);
      const childCode = participant.child_code?.trim();

      if (!childCode || !phoneNumber) {
        return jsonResponse({ error: 'child_code and phone_number are required.' }, 400);
      }

      const cohort = await getActiveCohort(supabase, participant.cohort_id);
      const student = await findOrCreateStudent(supabase, phoneNumber, participant.display_name);
      const payload = {
        cohort_id: cohort.id,
        student_id: student.id,
        child_code: childCode,
        display_name: participant.display_name || '',
        phone_number: phoneNumber,
        caregiver_name: participant.caregiver_name || null,
        caregiver_phone: participant.caregiver_phone ? normalizePhone(participant.caregiver_phone) : null,
        age_years: participant.age_years || null,
        network: participant.network || null,
        location_label: participant.location_label || null,
        language_profile: participant.language_profile || null,
        preferred_call_window: participant.preferred_call_window || null,
        consent_status: participant.consent_status || 'not_started',
        assent_status: participant.assent_status || 'not_started',
        onboarding_status: participant.onboarding_status || 'not_started',
        baseline_status: participant.baseline_status || 'not_started',
        endline_status: participant.endline_status || 'not_started',
        risk_level: participant.risk_level || 'low',
        notes: participant.notes || null,
      };

      const { data, error } = await supabase
        .from('sabi_prepilot_participants')
        .upsert(payload, { onConflict: 'child_code' })
        .select()
        .single();

      if (error) throw error;
      return jsonResponse({ participant: data });
    }

    if (body.action === 'log_review') {
      const review = body.review;
      if (!review.participant_id) {
        return jsonResponse({ error: 'participant_id is required.' }, 400);
      }

      const { data, error } = await supabase
        .from('sabi_prepilot_call_reviews')
        .insert({
          participant_id: review.participant_id,
          session_id: review.session_id || null,
          call_sid: review.call_sid || null,
          call_started_at: review.call_started_at || null,
          duration_seconds: review.duration_seconds || null,
          connection_status: review.connection_status || 'connected',
          lesson_status: review.lesson_status || 'partial',
          transcript_quality: review.transcript_quality ?? null,
          audio_quality: review.audio_quality ?? null,
          child_engagement: review.child_engagement ?? null,
          learning_signal: review.learning_signal ?? null,
          safety_flag: Boolean(review.safety_flag),
          follow_up_required: Boolean(review.follow_up_required),
          reviewed_by: review.reviewed_by || null,
          operator_notes: review.operator_notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (review.session_id) {
        await supabase
          .from('sabi_sessions')
          .update({ reviewed_at: new Date().toISOString() })
          .eq('id', review.session_id);
      }

      return jsonResponse({ review: data });
    }

    if (body.action === 'log_event') {
      const event = body.event;
      if (!event.title?.trim()) {
        return jsonResponse({ error: 'event title is required.' }, 400);
      }

      const { data, error } = await supabase
        .from('sabi_prepilot_events')
        .insert({
          participant_id: event.participant_id || null,
          event_type: event.event_type || 'operator_note',
          severity: event.severity || 'info',
          title: event.title.trim(),
          details: event.details || null,
          owner: event.owner || null,
          status: event.status || 'open',
          due_at: event.due_at || null,
        })
        .select()
        .single();

      if (error) throw error;
      return jsonResponse({ event: data });
    }

    if (body.action === 'update_event') {
      const patch = {
        ...body.patch,
        resolved_at: body.patch.status === 'resolved'
          ? body.patch.resolved_at || new Date().toISOString()
          : body.patch.resolved_at,
      };
      const { data, error } = await supabase
        .from('sabi_prepilot_events')
        .update(patch)
        .eq('id', body.event_id)
        .select()
        .single();

      if (error) throw error;
      return jsonResponse({ event: data });
    }

    return jsonResponse({ error: 'Unknown action.' }, 400);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Pre-pilot operation failed.' },
      500,
    );
  }
}
