'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  computeCohortMetrics,
  dailyOperatorChecklist,
  daysSince,
  formatDateTime,
  launchGates,
  maskPhone,
  metricsForParticipant,
  moduleLabels,
  scoreLabel,
  type PrepilotData,
  type PrepilotParticipant,
  type SabiSessionForPilot,
} from '@/lib/sabi-prepilot';

type ParticipantForm = {
  child_code: string;
  display_name: string;
  phone_number: string;
  caregiver_name: string;
  caregiver_phone: string;
  age_years: string;
  network: string;
  location_label: string;
  language_profile: string;
  preferred_call_window: string;
  consent_status: string;
  assent_status: string;
  onboarding_status: string;
  baseline_status: string;
  endline_status: string;
  risk_level: string;
  notes: string;
};

type ReviewForm = {
  session_id: string;
  connection_status: string;
  lesson_status: string;
  transcript_quality: string;
  audio_quality: string;
  child_engagement: string;
  learning_signal: string;
  safety_flag: boolean;
  follow_up_required: boolean;
  reviewed_by: string;
  operator_notes: string;
};

type EventForm = {
  event_type: string;
  severity: string;
  title: string;
  details: string;
  owner: string;
};

const emptyData: PrepilotData = {
  cohorts: [],
  activeCohort: null,
  participants: [],
  sessions: [],
  reviews: [],
  events: [],
};

function emptyParticipantForm(nextCode = 'SABI-001'): ParticipantForm {
  return {
    child_code: nextCode,
    display_name: '',
    phone_number: '',
    caregiver_name: '',
    caregiver_phone: '',
    age_years: '',
    network: '',
    location_label: '',
    language_profile: '',
    preferred_call_window: '',
    consent_status: 'not_started',
    assent_status: 'not_started',
    onboarding_status: 'not_started',
    baseline_status: 'not_started',
    endline_status: 'not_started',
    risk_level: 'low',
    notes: '',
  };
}

const emptyReviewForm: ReviewForm = {
  session_id: '',
  connection_status: 'connected',
  lesson_status: 'partial',
  transcript_quality: '',
  audio_quality: '',
  child_engagement: '',
  learning_signal: '',
  safety_flag: false,
  follow_up_required: false,
  reviewed_by: 'Naomi',
  operator_notes: '',
};

const emptyEventForm: EventForm = {
  event_type: 'operator_note',
  severity: 'info',
  title: '',
  details: '',
  owner: 'Naomi',
};

const badgeStyles: Record<string, string> = {
  good: 'bg-emerald-100 text-emerald-800',
  warn: 'bg-amber-100 text-amber-900',
  bad: 'bg-rose-100 text-rose-800',
  neutral: 'bg-gray-100 text-gray-700',
  info: 'bg-sky-100 text-sky-800',
};

function statusBadge(status: string) {
  if (['done', 'verbal_ok', 'written_ok', 'completed', 'connected', 'low', 'resolved'].includes(status)) {
    return badgeStyles.good;
  }
  if (['sent', 'scheduled', 'watch', 'waiting', 'partial'].includes(status)) return badgeStyles.warn;
  if (['declined', 'blocked', 'high', 'urgent', 'audio_failed', 'carrier_issue'].includes(status)) {
    return badgeStyles.bad;
  }
  return badgeStyles.neutral;
}

function nextChildCode(participants: PrepilotParticipant[]) {
  const maxNumber = participants.reduce((max, participant) => {
    const match = participant.child_code.match(/(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `SABI-${String(maxNumber + 1).padStart(3, '0')}`;
}

function formFromParticipant(participant: PrepilotParticipant): ParticipantForm {
  return {
    child_code: participant.child_code,
    display_name: participant.display_name || '',
    phone_number: participant.phone_number || '',
    caregiver_name: participant.caregiver_name || '',
    caregiver_phone: participant.caregiver_phone || '',
    age_years: participant.age_years ? String(participant.age_years) : '',
    network: participant.network || '',
    location_label: participant.location_label || '',
    language_profile: participant.language_profile || '',
    preferred_call_window: participant.preferred_call_window || '',
    consent_status: participant.consent_status,
    assent_status: participant.assent_status,
    onboarding_status: participant.onboarding_status,
    baseline_status: participant.baseline_status,
    endline_status: participant.endline_status,
    risk_level: participant.risk_level,
    notes: participant.notes || '',
  };
}

function numberOrNull(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sessionLabel(session: SabiSessionForPilot) {
  const moduleName = typeof session.recommended_module === 'number'
    ? moduleLabels[session.recommended_module] || `Module ${session.recommended_module}`
    : 'No module';
  const minutes = session.duration_seconds ? `${Math.round(session.duration_seconds / 6) / 10} min` : 'no duration';
  return `${formatDateTime(session.created_at)} - ${moduleName} - ${minutes}`;
}

export default function SabiPrepilotPage() {
  const [data, setData] = useState<PrepilotData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [participantForm, setParticipantForm] = useState<ParticipantForm>(emptyParticipantForm());
  const [reviewForm, setReviewForm] = useState<ReviewForm>(emptyReviewForm);
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const selectedParticipant =
    data.participants.find((participant) => participant.id === selectedId) || data.participants[0] || null;

  const selectedMetrics = selectedParticipant
    ? metricsForParticipant(selectedParticipant, data.sessions, data.reviews, data.events)
    : null;

  const cohortMetrics = useMemo(() => computeCohortMetrics(data), [data]);

  const gateResults = useMemo(() => {
    const target = Math.min(cohortMetrics.targetChildren, Math.max(cohortMetrics.totalChildren, 1));
    return [
      cohortMetrics.consentReady >= target && cohortMetrics.assentReady >= target,
      data.participants.length > 0 &&
        data.participants.every(
          (participant) => participant.phone_number && participant.network && participant.preferred_call_window,
        ),
      cohortMetrics.baselineDone >= target,
      cohortMetrics.totalSessions > 0,
      cohortMetrics.participantsWithFirstCall === 0 ||
        cohortMetrics.reviewedSessions >= cohortMetrics.participantsWithFirstCall,
      cohortMetrics.urgentEvents === 0,
      cohortMetrics.participantsWithFirstCall >= Math.min(7, target),
      cohortMetrics.participantsWithSecondCall >= Math.min(5, target),
    ];
  }, [cohortMetrics, data.participants]);

  async function loadData() {
    setLoading(true);
    setNotice('');
    try {
      const response = await fetch('/api/sabi/prepilot', { cache: 'no-store' });
      const nextData = (await response.json()) as PrepilotData & { error?: string };
      if (nextData.error) {
        setNotice(nextData.error);
      } else {
        setData(nextData);
        if (!selectedId && nextData.participants[0]) {
          setSelectedId(nextData.participants[0].id);
        }
        if (!nextData.participants.length) {
          setParticipantForm(emptyParticipantForm());
        }
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Failed to load pre-pilot data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const saved = window.localStorage.getItem('sabi-prepilot-daily-checklist');
    if (saved) setChecklist(JSON.parse(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.localStorage.setItem('sabi-prepilot-daily-checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    if (selectedParticipant) {
      setParticipantForm(formFromParticipant(selectedParticipant));
      const latestSession = metricsForParticipant(selectedParticipant, data.sessions, data.reviews, data.events)
        .sessions[0];
      setReviewForm({
        ...emptyReviewForm,
        session_id: latestSession?.id || '',
        call_started_at: latestSession?.created_at,
      } as ReviewForm);
      setEventForm(emptyEventForm);
    } else {
      setParticipantForm(emptyParticipantForm(nextChildCode(data.participants)));
    }
  }, [selectedParticipant, data.sessions, data.reviews, data.events, data.participants]);

  function updateParticipantField(field: keyof ParticipantForm, value: string) {
    setParticipantForm((current) => ({ ...current, [field]: value }));
  }

  async function postAction(body: unknown, successMessage: string) {
    setSaving(true);
    setNotice('');
    try {
      const response = await fetch('/api/sabi/prepilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        setNotice(result.error || 'Save failed.');
        return;
      }
      setNotice(successMessage);
      await loadData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function saveParticipant() {
    await postAction(
      {
        action: 'upsert_participant',
        participant: {
          ...participantForm,
          age_years: numberOrNull(participantForm.age_years),
          cohort_id: data.activeCohort?.id,
        },
      },
      'Participant saved and linked to Sabi memory.',
    );
  }

  async function saveReview() {
    if (!selectedParticipant) return;
    const session = selectedMetrics?.sessions.find((item) => item.id === reviewForm.session_id);
    await postAction(
      {
        action: 'log_review',
        review: {
          participant_id: selectedParticipant.id,
          session_id: reviewForm.session_id || null,
          call_sid: session?.call_sid || null,
          call_started_at: session?.created_at || null,
          duration_seconds: session?.duration_seconds || null,
          connection_status: reviewForm.connection_status,
          lesson_status: reviewForm.lesson_status,
          transcript_quality: numberOrNull(reviewForm.transcript_quality),
          audio_quality: numberOrNull(reviewForm.audio_quality),
          child_engagement: numberOrNull(reviewForm.child_engagement),
          learning_signal: numberOrNull(reviewForm.learning_signal),
          safety_flag: reviewForm.safety_flag,
          follow_up_required: reviewForm.follow_up_required,
          reviewed_by: reviewForm.reviewed_by,
          operator_notes: reviewForm.operator_notes,
        },
      },
      'Call review saved.',
    );
  }

  async function saveEvent() {
    await postAction(
      {
        action: 'log_event',
        event: {
          participant_id: selectedParticipant?.id || null,
          ...eventForm,
        },
      },
      'Event logged.',
    );
  }

  async function resolveEvent(eventId: string) {
    await postAction(
      {
        action: 'update_event',
        event_id: eventId,
        patch: { status: 'resolved' },
      },
      'Event resolved.',
    );
  }

  return (
    <main className="min-h-screen bg-[#f6faf8]">
      <section className="border-b border-emerald-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
                Sabi Pre-Pilot
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-950">10-Child Control Room</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                Cohort roster, consent state, call reviews, follow-ups, and launch gates for the concierge phone pilot.
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="border border-[var(--primary-dark)] px-4 py-2 text-sm font-semibold text-[var(--primary-dark)] hover:bg-emerald-50 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ['Children', `${cohortMetrics.totalChildren}/${cohortMetrics.targetChildren}`],
              ['Call-ready', cohortMetrics.callReady],
              ['First calls', cohortMetrics.participantsWithFirstCall],
              ['Second calls', cohortMetrics.participantsWithSecondCall],
              ['Reviewed', cohortMetrics.reviewedSessions],
              ['Open alerts', cohortMetrics.openEvents],
            ].map(([label, value]) => (
              <div key={label} className="border border-gray-200 bg-white px-4 py-3">
                <div className="text-2xl font-bold text-gray-950">{value}</div>
                <div className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <section className="space-y-6">
          {notice && (
            <div className="border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              {notice}
            </div>
          )}

          {data.setupNeeded && (
            <div className="border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
              Run <span className="font-mono">supabase-sabi-prepilot.sql</span> in Supabase before using this page.
              Supabase said: {data.setupError}
            </div>
          )}

          <section className="border border-gray-200 bg-white p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-950">Launch gates</h2>
                <p className="text-sm text-gray-600">
                  These are the gates that should be green before moving beyond the first 10 children.
                </p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold ${gateResults.every(Boolean) ? badgeStyles.good : badgeStyles.warn}`}>
                {gateResults.filter(Boolean).length}/{gateResults.length} ready
              </span>
            </div>
            <div className="mt-4 grid gap-2 lg:grid-cols-2">
              {launchGates.map((gate, index) => (
                <div key={gate} className="flex items-start gap-3 border border-gray-100 p-3">
                  <span className={`mt-0.5 px-2 py-1 text-xs font-bold ${gateResults[index] ? badgeStyles.good : badgeStyles.neutral}`}>
                    {gateResults[index] ? 'OK' : 'WAIT'}
                  </span>
                  <p className="text-sm leading-6 text-gray-700">{gate}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-950">Children</h2>
                <p className="text-sm text-gray-600">
                  Select a child to review calls, log events, or update readiness.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedId('');
                  setParticipantForm(emptyParticipantForm(nextChildCode(data.participants)));
                }}
                className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                New child
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-[0.12em] text-gray-500">
                    <th className="py-3 pr-3">Child</th>
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Consent</th>
                    <th className="px-3 py-3">Baseline</th>
                    <th className="px-3 py-3">Calls</th>
                    <th className="px-3 py-3">Last call</th>
                    <th className="px-3 py-3">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td className="py-6 text-gray-500" colSpan={7}>Loading pilot data...</td>
                    </tr>
                  )}
                  {!loading && data.participants.length === 0 && (
                    <tr>
                      <td className="py-6 text-gray-500" colSpan={7}>
                        No children registered yet. Add the first child in the right panel.
                      </td>
                    </tr>
                  )}
                  {data.participants.map((participant) => {
                    const metrics = metricsForParticipant(participant, data.sessions, data.reviews, data.events);
                    const selected = selectedParticipant?.id === participant.id;
                    return (
                      <tr
                        key={participant.id}
                        onClick={() => setSelectedId(participant.id)}
                        className={`cursor-pointer border-b border-gray-100 hover:bg-emerald-50/60 ${
                          selected ? 'bg-emerald-50' : ''
                        }`}
                      >
                        <td className="py-3 pr-3">
                          <div className="font-bold text-gray-950">{participant.child_code}</div>
                          <div className="text-xs text-gray-600">{participant.display_name || 'Name pending'}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div>{maskPhone(participant.phone_number)}</div>
                          <div className="text-xs text-gray-500">{participant.network || 'Network?'}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold ${statusBadge(participant.consent_status)}`}>
                            {participant.consent_status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold ${statusBadge(participant.baseline_status)}`}>
                            {participant.baseline_status}
                          </span>
                        </td>
                        <td className="px-3 py-3">{metrics.sessionCount}</td>
                        <td className="px-3 py-3">
                          <div>{formatDateTime(metrics.lastCallAt)}</div>
                          {metrics.lastCallAt && (
                            <div className="text-xs text-gray-500">{daysSince(metrics.lastCallAt)}d ago</div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold ${statusBadge(participant.risk_level)}`}>
                            {metrics.needsFollowUp ? 'follow up' : participant.risk_level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {selectedParticipant && selectedMetrics && (
            <section className="border border-gray-200 bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">
                    {selectedParticipant.child_code}: {selectedParticipant.display_name || 'Name pending'}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {maskPhone(selectedParticipant.phone_number)} · {selectedParticipant.network || 'network unknown'} ·{' '}
                    {selectedParticipant.preferred_call_window || 'call window pending'}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold ${selectedMetrics.readyForCalls ? badgeStyles.good : badgeStyles.warn}`}>
                  {selectedMetrics.readyForCalls ? 'Ready for calls' : 'Not ready yet'}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ['Sessions', selectedMetrics.sessionCount],
                  ['Minutes', selectedMetrics.totalMinutes],
                  ['Avg engagement', selectedMetrics.averageEngagement?.toFixed(1) || '-'],
                  ['Avg learning', selectedMetrics.averageLearningSignal?.toFixed(1) || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-gray-100 bg-gray-50 px-3 py-3">
                    <div className="text-xl font-bold text-gray-950">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-500">Recent calls</h3>
                  <div className="mt-3 space-y-2">
                    {selectedMetrics.sessions.length === 0 && (
                      <p className="border border-gray-100 p-3 text-sm text-gray-500">No saved calls yet.</p>
                    )}
                    {selectedMetrics.sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="border border-gray-100 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-950">{sessionLabel(session)}</p>
                            <p className="mt-1 text-xs leading-5 text-gray-600">
                              {session.summary || 'No automatic summary yet.'}
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100">
                            {session.channel || 'voice'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-500">Open events</h3>
                  <div className="mt-3 space-y-2">
                    {selectedMetrics.openEvents.length === 0 && (
                      <p className="border border-gray-100 p-3 text-sm text-gray-500">No open events.</p>
                    )}
                    {selectedMetrics.openEvents.map((event) => (
                      <div key={event.id} className="border border-gray-100 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-950">{event.title}</p>
                            <p className="mt-1 text-xs leading-5 text-gray-600">{event.details || event.event_type}</p>
                          </div>
                          <button
                            onClick={() => resolveEvent(event.id)}
                            className="border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="border border-gray-200 bg-white p-5">
            <h2 className="text-xl font-bold text-gray-950">Daily operator checklist</h2>
            <div className="mt-4 grid gap-2 lg:grid-cols-2">
              {dailyOperatorChecklist.map((item) => (
                <label key={item} className="flex items-start gap-3 border border-gray-100 p-3">
                  <input
                    type="checkbox"
                    checked={Boolean(checklist[item])}
                    onChange={(event) => setChecklist((current) => ({ ...current, [item]: event.target.checked }))}
                    className="mt-1"
                  />
                  <span className="text-sm leading-6 text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-950">
              {selectedParticipant ? 'Update child' : 'Add child'}
            </h2>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Code
                  <input value={participantForm.child_code} onChange={(event) => updateParticipantField('child_code', event.target.value)} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
                </label>
                <label className="text-sm font-semibold text-gray-700">
                  Age
                  <input value={participantForm.age_years} onChange={(event) => updateParticipantField('age_years', event.target.value)} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
                </label>
              </div>
              <label className="text-sm font-semibold text-gray-700">
                Child name
                <input value={participantForm.display_name} onChange={(event) => updateParticipantField('display_name', event.target.value)} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Child phone
                <input value={participantForm.phone_number} onChange={(event) => updateParticipantField('phone_number', event.target.value)} placeholder="+234..." className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Network
                  <input value={participantForm.network} onChange={(event) => updateParticipantField('network', event.target.value)} placeholder="MTN/Glo/Airtel" className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
                </label>
                <label className="text-sm font-semibold text-gray-700">
                  Call window
                  <input value={participantForm.preferred_call_window} onChange={(event) => updateParticipantField('preferred_call_window', event.target.value)} placeholder="4-6 PM" className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
                </label>
              </div>
              <label className="text-sm font-semibold text-gray-700">
                Caregiver
                <input value={participantForm.caregiver_name} onChange={(event) => updateParticipantField('caregiver_name', event.target.value)} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Caregiver phone
                <input value={participantForm.caregiver_phone} onChange={(event) => updateParticipantField('caregiver_phone', event.target.value)} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['consent_status', 'Consent', ['not_started', 'sent', 'verbal_ok', 'written_ok', 'declined']],
                  ['assent_status', 'Assent', ['not_started', 'verbal_ok', 'declined']],
                  ['onboarding_status', 'Onboarding', ['not_started', 'scheduled', 'done', 'blocked']],
                  ['baseline_status', 'Baseline', ['not_started', 'scheduled', 'done', 'blocked']],
                ].map(([field, label, options]) => (
                  <label key={field as string} className="text-sm font-semibold text-gray-700">
                    {label as string}
                    <select
                      value={participantForm[field as keyof ParticipantForm]}
                      onChange={(event) => updateParticipantField(field as keyof ParticipantForm, event.target.value)}
                      className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]"
                    >
                      {(options as string[]).map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <label className="text-sm font-semibold text-gray-700">
                Risk
                <select value={participantForm.risk_level} onChange={(event) => updateParticipantField('risk_level', event.target.value)} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]">
                  <option>low</option>
                  <option>watch</option>
                  <option>high</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Language / notes
                <textarea value={participantForm.notes} onChange={(event) => updateParticipantField('notes', event.target.value)} className="mt-1 min-h-20 w-full border border-gray-200 p-3 outline-none focus:border-[var(--primary-dark)]" />
              </label>
              <button onClick={saveParticipant} disabled={saving} className="bg-[var(--primary-dark)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-darker)] disabled:opacity-50">
                Save child
              </button>
            </div>
          </section>

          <section className="border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-950">Review latest call</h2>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-semibold text-gray-700">
                Session
                <select value={reviewForm.session_id} onChange={(event) => setReviewForm((current) => ({ ...current, session_id: event.target.value }))} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]">
                  <option value="">Choose a saved call</option>
                  {(selectedMetrics?.sessions || []).map((session) => (
                    <option key={session.id} value={session.id}>{sessionLabel(session)}</option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Connection
                  <select value={reviewForm.connection_status} onChange={(event) => setReviewForm((current) => ({ ...current, connection_status: event.target.value }))} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]">
                    {['connected', 'dropped', 'carrier_issue', 'audio_failed', 'no_answer', 'unknown'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-gray-700">
                  Lesson
                  <select value={reviewForm.lesson_status} onChange={(event) => setReviewForm((current) => ({ ...current, lesson_status: event.target.value }))} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]">
                    {['completed', 'partial', 'abandoned', 'not_learning', 'unknown'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  ['transcript_quality', 'Transcript'],
                  ['audio_quality', 'Audio'],
                  ['child_engagement', 'Engage'],
                  ['learning_signal', 'Learn'],
                ].map(([field, label]) => (
                  <label key={field} className="text-xs font-semibold text-gray-700">
                    {label}
                    <select value={reviewForm[field as keyof ReviewForm] as string} onChange={(event) => setReviewForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full border border-gray-200 px-2 py-2 outline-none focus:border-[var(--primary-dark)]">
                      <option value="">-</option>
                      <option value="0">0 {scoreLabel(0)}</option>
                      <option value="1">1 {scoreLabel(1)}</option>
                      <option value="2">2 {scoreLabel(2)}</option>
                      <option value="3">3 {scoreLabel(3)}</option>
                    </select>
                  </label>
                ))}
              </div>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={reviewForm.safety_flag} onChange={(event) => setReviewForm((current) => ({ ...current, safety_flag: event.target.checked }))} className="mt-1" />
                Safety flag
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={reviewForm.follow_up_required} onChange={(event) => setReviewForm((current) => ({ ...current, follow_up_required: event.target.checked }))} className="mt-1" />
                Caregiver/operator follow-up required
              </label>
              <textarea value={reviewForm.operator_notes} onChange={(event) => setReviewForm((current) => ({ ...current, operator_notes: event.target.value }))} placeholder="What happened? What should change before the next call?" className="min-h-24 w-full border border-gray-200 p-3 text-sm outline-none focus:border-[var(--primary-dark)]" />
              <button onClick={saveReview} disabled={!selectedParticipant || saving} className="bg-[var(--primary-dark)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-darker)] disabled:opacity-50">
                Save review
              </button>
            </div>
          </section>

          <section className="border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-bold text-gray-950">Log event</h2>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Type
                  <select value={eventForm.event_type} onChange={(event) => setEventForm((current) => ({ ...current, event_type: event.target.value }))} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]">
                    {['operator_note', 'caregiver_follow_up', 'technical_issue', 'safety_concern', 'learning_concern', 'consent_issue', 'call_scheduling'].map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-gray-700">
                  Severity
                  <select value={eventForm.severity} onChange={(event) => setEventForm((current) => ({ ...current, severity: event.target.value }))} className="mt-1 w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]">
                    <option>info</option>
                    <option>watch</option>
                    <option>urgent</option>
                  </select>
                </label>
              </div>
              <input value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} placeholder="Short title" className="w-full border border-gray-200 px-3 py-2 outline-none focus:border-[var(--primary-dark)]" />
              <textarea value={eventForm.details} onChange={(event) => setEventForm((current) => ({ ...current, details: event.target.value }))} placeholder="Details and next action" className="min-h-20 w-full border border-gray-200 p-3 text-sm outline-none focus:border-[var(--primary-dark)]" />
              <button onClick={saveEvent} disabled={saving || !eventForm.title.trim()} className="border border-[var(--primary-dark)] px-3 py-2 text-sm font-semibold text-[var(--primary-dark)] hover:bg-emerald-50 disabled:opacity-50">
                Log event
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
