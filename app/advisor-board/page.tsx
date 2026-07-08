'use client';

import {
  advisorProfiles,
  createInitialAdvisorState,
  firstMeetingEmail,
  followUpEmail,
  type AdvisorProfile,
  type AdvisorRuntimeState,
  type AdvisorStatus,
} from '@/lib/advisor-board';
import { SabiDirectCallPanel } from '@/components/SabiDirectCallPanel';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type AdvisorStateMap = Record<string, AdvisorRuntimeState & { emailOverride?: string }>;

type GmailSyncResult = {
  advisorId: string;
  connected?: boolean;
  error?: string;
  needsEmail?: boolean;
  messageCount?: number;
  lastInbound?: {
    threadId: string;
    subject: string;
    date: string;
    snippet: string;
  };
  lastOutbound?: {
    threadId: string;
    subject: string;
    date: string;
    snippet: string;
  };
};

const STORAGE_KEY = 'education-for-equality-advisor-board-v1';
const DEFAULT_FROM_EMAIL = 'naomi.ivie04@gmail.com';

const statusLabels: Record<AdvisorStatus, string> = {
  not_contacted: 'Not contacted',
  drafted: 'Draft ready',
  sent: 'Waiting',
  responded: 'Responded',
  follow_up_due: 'Follow up',
  blocked: 'Blocked',
};

const statusStyles: Record<AdvisorStatus, string> = {
  not_contacted: 'bg-gray-100 text-gray-700',
  drafted: 'bg-sky-100 text-sky-800',
  sent: 'bg-amber-100 text-amber-800',
  responded: 'bg-emerald-100 text-emerald-800',
  follow_up_due: 'bg-rose-100 text-rose-800',
  blocked: 'bg-zinc-200 text-zinc-800',
};

function initialState(): AdvisorStateMap {
  return Object.fromEntries(advisorProfiles.map((profile) => [profile.id, createInitialAdvisorState(profile)]));
}

function daysSince(date?: string) {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

function computeStatus(state: AdvisorRuntimeState): AdvisorStatus {
  if (state.lastResponseAt) return 'responded';
  const sentDays = daysSince(state.lastSentAt);
  if (sentDays !== null && sentDays >= 3) return 'follow_up_due';
  return state.status;
}

function stateSummary(profile: AdvisorProfile, state: AdvisorRuntimeState & { emailOverride?: string }) {
  const effectiveStatus = computeStatus(state);
  const sentDays = daysSince(state.lastSentAt);
  const responseDays = daysSince(state.lastResponseAt);

  if (effectiveStatus === 'follow_up_due') return `Sent ${sentDays}d ago. Follow up is due.`;
  if (state.lastResponseAt) return `Last response ${responseDays}d ago.`;
  if (state.lastSentAt) return `Sent ${sentDays}d ago. Waiting for reply.`;
  if (!(profile.email || state.emailOverride)) return 'Needs email address before sending.';
  return 'Ready for first meeting invite.';
}

function buildInstructionalNote(profile: AdvisorProfile) {
  return [
    `Use Naomi's voice: warm, clear, not over-formal.`,
    `Context to remember: ${profile.relationshipNote}`,
    `Primary ask: ${profile.firstMeetingAsk}`,
  ].join('\n');
}

export default function AdvisorBoardPage() {
  const [states, setStates] = useState<AdvisorStateMap>(() => initialState());
  const [selectedId, setSelectedId] = useState(advisorProfiles[0].id);
  const [composeMode, setComposeMode] = useState<'first-meeting' | 'follow-up' | 'custom'>('first-meeting');
  const [fromEmail, setFromEmail] = useState(DEFAULT_FROM_EMAIL);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [instruction, setInstruction] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const selected = advisorProfiles.find((profile) => profile.id === selectedId) || advisorProfiles[0];
  const selectedState = states[selected.id] || createInitialAdvisorState(selected);
  const selectedEmail = selectedState.emailOverride || selected.email || '';

  const boardStats = useMemo(() => {
    const effectiveStatuses = advisorProfiles.map((profile) => computeStatus(states[profile.id]));
    return {
      total: advisorProfiles.length,
      waiting: effectiveStatuses.filter((status) => status === 'sent').length,
      followUp: effectiveStatuses.filter((status) => status === 'follow_up_due').length,
      responded: effectiveStatuses.filter((status) => status === 'responded').length,
    };
  }, [states]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      setStates({ ...initialState(), ...(JSON.parse(saved) as AdvisorStateMap) });
    } catch {
      setStates(initialState());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  }, [states]);

  useEffect(() => {
    const email =
      composeMode === 'follow-up' ? followUpEmail(selected) : firstMeetingEmail(selected);
    setSubject(email.subject);
    setMessageBody(email.body);
    setInstruction(buildInstructionalNote(selected));
  }, [selected, composeMode]);

  function updateAdvisorState(advisorId: string, patch: Partial<AdvisorRuntimeState & { emailOverride?: string }>) {
    setStates((current) => ({
      ...current,
      [advisorId]: {
        ...(current[advisorId] || createInitialAdvisorState(advisorProfiles.find((p) => p.id === advisorId)!)),
        ...patch,
      },
    }));
  }

  async function gmailAction(action: 'sync' | 'draft' | 'send', profile: AdvisorProfile) {
    setBusy(`${action}:${profile.id}`);
    setNotice('');

    try {
      const state = states[profile.id] || createInitialAdvisorState(profile);
      const response = await fetch('/api/advisor-board/gmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          advisorId: profile.id,
          from: fromEmail,
          to: state.emailOverride || profile.email,
          subject,
          messageBody,
          confirmSend: action === 'send',
        }),
      });
      const result = (await response.json()) as GmailSyncResult & { action?: string; to?: string };

      if (result.error) {
        setNotice(result.error);
        return;
      }

      if (action === 'sync') {
        const inboundDate = result.lastInbound?.date ? new Date(result.lastInbound.date).toISOString() : undefined;
        const outboundDate = result.lastOutbound?.date ? new Date(result.lastOutbound.date).toISOString() : undefined;
        updateAdvisorState(profile.id, {
          lastResponseAt: inboundDate,
          lastSentAt: outboundDate,
          lastSubject: result.lastInbound?.subject || result.lastOutbound?.subject,
          gmailThreadId: result.lastInbound?.threadId || result.lastOutbound?.threadId,
          status: inboundDate ? 'responded' : outboundDate ? 'sent' : states[profile.id].status,
          notes: result.lastInbound?.snippet || states[profile.id].notes,
        });
        setNotice(`Synced ${profile.shortName}: ${result.messageCount || 0} recent message(s).`);
        return;
      }

      updateAdvisorState(profile.id, {
        status: action === 'draft' ? 'drafted' : 'sent',
        lastSentAt: action === 'send' ? new Date().toISOString() : states[profile.id].lastSentAt,
        lastSubject: subject,
      });
      setNotice(action === 'draft' ? `Draft created for ${profile.shortName}.` : `Sent to ${profile.shortName}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setBusy(null);
    }
  }

  function markResponded(profile: AdvisorProfile) {
    updateAdvisorState(profile.id, {
      status: 'responded',
      lastResponseAt: new Date().toISOString(),
    });
  }

  function copyEmail() {
    navigator.clipboard.writeText(`From: ${fromEmail}\nSubject: ${subject}\n\n${messageBody}`);
    setNotice('Copied email text.');
  }

  return (
    <main className="min-h-screen bg-[#f7fbf9]">
      <section className="border-b border-emerald-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-dark)]">
                Education for Equality
              </p>
              <h1 className="mt-2 text-3xl font-bold text-gray-950">Advisor Board Command Center</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                One place to track advisor asks, responses, first-meeting emails, follow-ups, and what each person
                should help move forward for Sabi.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/advisor-board/sabi-evidence"
                  className="bg-[var(--primary-dark)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-darker)]"
                >
                  Open Sabi evidence
                </Link>
                <Link
                  href="/advisor-board/sabi-evidence/export?mode=board"
                  className="border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  Download board CSV
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="min-w-20 border border-emerald-100 bg-emerald-50 px-3 py-2">
                <div className="text-xl font-bold text-gray-950">{boardStats.total}</div>
                <div className="text-xs text-gray-600">Advisors</div>
              </div>
              <div className="min-w-20 border border-amber-100 bg-amber-50 px-3 py-2">
                <div className="text-xl font-bold text-gray-950">{boardStats.waiting}</div>
                <div className="text-xs text-gray-600">Waiting</div>
              </div>
              <div className="min-w-20 border border-rose-100 bg-rose-50 px-3 py-2">
                <div className="text-xl font-bold text-gray-950">{boardStats.followUp}</div>
                <div className="text-xs text-gray-600">Follow</div>
              </div>
              <div className="min-w-20 border border-sky-100 bg-sky-50 px-3 py-2">
                <div className="text-xl font-bold text-gray-950">{boardStats.responded}</div>
                <div className="text-xs text-gray-600">Replied</div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <SabiDirectCallPanel compact />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {advisorProfiles.map((profile) => {
              const state = states[profile.id] || createInitialAdvisorState(profile);
              const effectiveStatus = computeStatus(state);
              const isSelected = selectedId === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => setSelectedId(profile.id)}
                  className={`aspect-[1.05] border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected ? 'border-[var(--primary-dark)] ring-2 ring-emerald-100' : 'border-gray-200'
                  }`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold leading-tight text-gray-950">{profile.shortName}</h2>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">{profile.title}</p>
                        </div>
                        <span className={`whitespace-nowrap px-2 py-1 text-xs font-semibold ${statusStyles[effectiveStatus]}`}>
                          {statusLabels[effectiveStatus]}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1">
                        {profile.focus.slice(0, 3).map((item) => (
                          <span key={item} className="bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">{stateSummary(profile, state)}</p>
                      <div className="mt-3 flex gap-2 text-xs text-gray-500">
                        <span>{state.tasks.filter((task) => task.status !== 'done').length} open ask(s)</span>
                        <span>{profile.email || state.emailOverride ? 'Email ready' : 'Email missing'}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <section className="mt-6 border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-950">{selected.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{selected.title}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => gmailAction('sync', selected)}
                  disabled={busy === `sync:${selected.id}`}
                  className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Sync Gmail
                </button>
                <button
                  onClick={() => markResponded(selected)}
                  className="border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  Mark replied
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-500">Open asks</h3>
                <div className="mt-3 space-y-2">
                  {selectedState.tasks.map((task) => (
                    <label key={task.id} className="flex items-start gap-3 border border-gray-100 p-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        onChange={(event) => {
                          updateAdvisorState(selected.id, {
                            tasks: selectedState.tasks.map((item) =>
                              item.id === task.id
                                ? { ...item, status: event.target.checked ? 'done' : 'todo' }
                                : item,
                            ),
                          });
                        }}
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-gray-900">{task.title}</span>
                        <span className="text-xs text-gray-500">{task.dueLabel}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-500">Agent notes</h3>
                <textarea
                  value={selectedState.notes}
                  onChange={(event) => updateAdvisorState(selected.id, { notes: event.target.value })}
                  className="mt-3 min-h-36 w-full border border-gray-200 p-3 text-sm leading-6 outline-none focus:border-[var(--primary-dark)]"
                />
              </div>
            </div>
          </section>
        </section>

        <aside className="border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-950">Email console</h2>
              <p className="text-sm text-gray-600">{selected.shortName}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold ${statusStyles[computeStatus(selectedState)]}`}>
              {statusLabels[computeStatus(selectedState)]}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 border border-gray-200 text-sm">
            {(['first-meeting', 'follow-up', 'custom'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setComposeMode(mode)}
                className={`px-2 py-2 font-semibold ${
                  composeMode === mode ? 'bg-[var(--primary-dark)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode === 'first-meeting' ? 'Meeting' : mode === 'follow-up' ? 'Follow-up' : 'Custom'}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm font-semibold text-gray-700">
            From
            <input
              value={fromEmail}
              onChange={(event) => setFromEmail(event.target.value)}
              className="mt-1 w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-dark)]"
            />
          </label>

          <label className="mt-3 block text-sm font-semibold text-gray-700">
            Email address
            <input
              value={selectedEmail}
              onChange={(event) => updateAdvisorState(selected.id, { emailOverride: event.target.value })}
              placeholder="Add advisor email"
              className="mt-1 w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-dark)]"
            />
          </label>

          <label className="mt-3 block text-sm font-semibold text-gray-700">
            Subject
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-1 w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary-dark)]"
            />
          </label>

          <label className="mt-3 block text-sm font-semibold text-gray-700">
            Message
            <textarea
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              className="mt-1 min-h-72 w-full border border-gray-200 p-3 text-sm leading-6 outline-none focus:border-[var(--primary-dark)]"
            />
          </label>

          <details className="mt-3 border border-gray-100 bg-gray-50 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700">Agent instruction context</summary>
            <textarea
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              className="mt-3 min-h-28 w-full border border-gray-200 p-3 text-xs leading-5 outline-none focus:border-[var(--primary-dark)]"
            />
          </details>

          {notice && (
            <div className="mt-4 border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              {notice}
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={copyEmail}
              className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Copy
            </button>
            <button
              onClick={() => gmailAction('draft', selected)}
              disabled={!selectedEmail || busy === `draft:${selected.id}`}
              className="border border-[var(--primary-dark)] px-3 py-2 text-sm font-semibold text-[var(--primary-dark)] hover:bg-emerald-50 disabled:opacity-50"
            >
              Draft
            </button>
            <button
              onClick={() => gmailAction('send', selected)}
              disabled={!selectedEmail || busy === `send:${selected.id}`}
              className="bg-[var(--primary-dark)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-darker)] disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-500">
            Gmail send only works when the From address is the authenticated Gmail account or a verified Gmail send-as
            alias. Right now Naomi wants this set to naomi.ivie04@gmail.com.
          </p>
        </aside>
      </div>
    </main>
  );
}
