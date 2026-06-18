export type CohortStatus = 'setup' | 'recruiting' | 'active' | 'paused' | 'completed';
export type ConsentStatus = 'not_started' | 'sent' | 'verbal_ok' | 'written_ok' | 'declined';
export type AssentStatus = 'not_started' | 'verbal_ok' | 'declined';
export type StageStatus = 'not_started' | 'scheduled' | 'done' | 'blocked';
export type RiskLevel = 'low' | 'watch' | 'high';
export type EventSeverity = 'info' | 'watch' | 'urgent';
export type EventStatus = 'open' | 'waiting' | 'resolved';

export type PrepilotCohort = {
  id: string;
  name: string;
  status: CohortStatus;
  target_child_count: number;
  target_start_date: string | null;
  target_end_date: string | null;
  operator_owner: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PrepilotParticipant = {
  id: string;
  cohort_id: string;
  student_id: string | null;
  child_code: string;
  display_name: string;
  phone_number: string;
  caregiver_name: string | null;
  caregiver_phone: string | null;
  age_years: number | null;
  network: string | null;
  location_label: string | null;
  language_profile: string | null;
  preferred_call_window: string | null;
  consent_status: ConsentStatus;
  assent_status: AssentStatus;
  onboarding_status: StageStatus;
  baseline_status: StageStatus;
  endline_status: StageStatus;
  risk_level: RiskLevel;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SabiSessionForPilot = {
  id: string;
  student_id: string | null;
  messages: Array<{ role: string; content: string }>;
  summary: string | null;
  correct_count: number | null;
  wrong_count: number | null;
  duration_seconds: number | null;
  topics_covered: string[] | null;
  recommended_module: number | null;
  phone_number?: string | null;
  call_sid?: string | null;
  channel?: string | null;
  created_at: string;
};

export type PrepilotCallReview = {
  id: string;
  participant_id: string;
  session_id: string | null;
  call_sid: string | null;
  call_started_at: string | null;
  duration_seconds: number | null;
  connection_status: 'unknown' | 'connected' | 'no_answer' | 'dropped' | 'carrier_issue' | 'audio_failed';
  lesson_status: 'unknown' | 'completed' | 'partial' | 'abandoned' | 'not_learning';
  transcript_quality: number | null;
  audio_quality: number | null;
  child_engagement: number | null;
  learning_signal: number | null;
  safety_flag: boolean;
  follow_up_required: boolean;
  reviewed_by: string | null;
  operator_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PrepilotEvent = {
  id: string;
  participant_id: string | null;
  event_type:
    | 'operator_note'
    | 'caregiver_follow_up'
    | 'technical_issue'
    | 'safety_concern'
    | 'learning_concern'
    | 'consent_issue'
    | 'call_scheduling';
  severity: EventSeverity;
  title: string;
  details: string | null;
  owner: string | null;
  status: EventStatus;
  due_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PrepilotData = {
  setupNeeded?: boolean;
  setupError?: string;
  cohorts: PrepilotCohort[];
  activeCohort: PrepilotCohort | null;
  participants: PrepilotParticipant[];
  sessions: SabiSessionForPilot[];
  reviews: PrepilotCallReview[];
  events: PrepilotEvent[];
};

export type ParticipantMetrics = {
  sessions: SabiSessionForPilot[];
  reviews: PrepilotCallReview[];
  openEvents: PrepilotEvent[];
  sessionCount: number;
  reviewedCount: number;
  totalMinutes: number;
  lastCallAt: string | null;
  averageEngagement: number | null;
  averageLearningSignal: number | null;
  needsFollowUp: boolean;
  readyForCalls: boolean;
};

export const moduleLabels: Record<number, string> = {
  0: 'Diagnostic',
  1: 'Counting',
  2: 'Addition',
  3: 'Subtraction',
  4: 'Multiplication',
  5: 'Division',
  6: 'Word problems',
  7: 'Grade 4 bridge',
};

export const launchGates = [
  '10 children have caregiver consent and child assent recorded.',
  'Every child has one working phone number, network, and preferred call window.',
  'Baseline diagnostic is complete or scheduled for every child.',
  'Sabi can place direct inbound/outbound calls and save the session into Supabase.',
  'Each first call gets a human review within 24 hours.',
  'Open safety or urgent technical events are resolved before adding more children.',
  'At least 7 of 10 children complete a first lesson without operator rescue.',
  'At least 5 of 10 children return for a second call within 72 hours.',
] as const;

export const dailyOperatorChecklist = [
  'Check PBX health, Sabi API health, Supabase, and AT/phone provider dashboard.',
  'Call one internal test number and confirm audio, barge-in, STT, TTS, and session saving.',
  'Review yesterday\'s unreviewed calls and tag audio/transcript/learning quality.',
  'Message or call caregivers for children who missed their preferred call window.',
  'Resolve urgent events before starting new calls.',
  'Export or screenshot the daily dashboard for the pilot log.',
] as const;

export function maskPhone(phone?: string | null) {
  if (!phone) return 'No phone';
  const compact = phone.replace(/\s+/g, '');
  if (compact.length <= 4) return compact;
  return `${compact.slice(0, 4)}...${compact.slice(-4)}`;
}

export function formatDateTime(value?: string | null) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function daysSince(value?: string | null) {
  if (!value) return null;
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
}

function average(values: Array<number | null | undefined>) {
  const valid = values.filter((value): value is number => typeof value === 'number');
  if (!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

export function sessionsForParticipant(
  participant: PrepilotParticipant,
  sessions: SabiSessionForPilot[],
) {
  return sessions
    .filter((session) => {
      const sameStudent = participant.student_id && session.student_id === participant.student_id;
      const samePhone = participant.phone_number && session.phone_number === participant.phone_number;
      return Boolean(sameStudent || samePhone);
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function metricsForParticipant(
  participant: PrepilotParticipant,
  sessions: SabiSessionForPilot[],
  reviews: PrepilotCallReview[],
  events: PrepilotEvent[],
): ParticipantMetrics {
  const participantSessions = sessionsForParticipant(participant, sessions);
  const participantReviews = reviews.filter((review) => review.participant_id === participant.id);
  const openEvents = events.filter(
    (event) => event.participant_id === participant.id && event.status !== 'resolved',
  );
  const totalSeconds = participantSessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);
  const urgentOpen = openEvents.some((event) => event.severity === 'urgent');
  const readyForCalls =
    ['verbal_ok', 'written_ok'].includes(participant.consent_status) &&
    participant.assent_status === 'verbal_ok' &&
    participant.onboarding_status === 'done' &&
    Boolean(participant.phone_number) &&
    !urgentOpen;

  return {
    sessions: participantSessions,
    reviews: participantReviews,
    openEvents,
    sessionCount: participantSessions.length,
    reviewedCount: participantReviews.length,
    totalMinutes: Math.round((totalSeconds / 60) * 10) / 10,
    lastCallAt: participantSessions[0]?.created_at || null,
    averageEngagement: average(participantReviews.map((review) => review.child_engagement)),
    averageLearningSignal: average(participantReviews.map((review) => review.learning_signal)),
    needsFollowUp:
      participant.risk_level !== 'low' ||
      urgentOpen ||
      participantReviews.some((review) => review.follow_up_required || review.safety_flag),
    readyForCalls,
  };
}

export function computeCohortMetrics(data: PrepilotData) {
  const participantMetrics = data.participants.map((participant) =>
    metricsForParticipant(participant, data.sessions, data.reviews, data.events),
  );
  const openEvents = data.events.filter((event) => event.status !== 'resolved');
  const urgentEvents = openEvents.filter((event) => event.severity === 'urgent');
  const participantsWithFirstCall = participantMetrics.filter((metrics) => metrics.sessionCount > 0).length;
  const participantsWithSecondCall = participantMetrics.filter((metrics) => metrics.sessionCount >= 2).length;

  return {
    totalChildren: data.participants.length,
    targetChildren: data.activeCohort?.target_child_count || 10,
    consentReady: data.participants.filter((participant) =>
      ['verbal_ok', 'written_ok'].includes(participant.consent_status),
    ).length,
    assentReady: data.participants.filter((participant) => participant.assent_status === 'verbal_ok').length,
    baselineDone: data.participants.filter((participant) => participant.baseline_status === 'done').length,
    callReady: participantMetrics.filter((metrics) => metrics.readyForCalls).length,
    participantsWithFirstCall,
    participantsWithSecondCall,
    totalSessions: data.sessions.length,
    reviewedSessions: data.reviews.length,
    openEvents: openEvents.length,
    urgentEvents: urgentEvents.length,
    totalMinutes: Math.round(
      (data.sessions.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) / 60) * 10,
    ) / 10,
  };
}

export function scoreLabel(score?: number | null) {
  if (score === null || score === undefined) return 'Not scored';
  if (score >= 3) return 'Strong';
  if (score >= 2) return 'Usable';
  if (score >= 1) return 'Weak';
  return 'Failed';
}
