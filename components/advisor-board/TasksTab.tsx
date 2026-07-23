'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NotionPerson, TaskArea, TaskPriority, TaskRecord, TaskStatus } from '@/lib/notion/types';

type View = 'open' | 'mine' | 'all' | 'done';

const AREAS: TaskArea[] = [
  'Partnerships',
  'Fundraising',
  'Pilot Ops',
  'Curriculum',
  'Evidence',
  'Product',
  'Telephony',
  'Safety',
  'Legal/IP',
  'Finance',
  'Admin',
];

const PRIORITIES: TaskPriority[] = ['P0', 'P1', 'P2', 'P3'];
const STATUSES: TaskStatus[] = ['Not Started', 'Next', 'In Progress', 'Waiting', 'Blocked', 'Done', 'Dropped'];

const priorityStyles: Record<TaskPriority, string> = {
  P0: 'bg-rose-100 text-rose-800 ring-1 ring-rose-200',
  P1: 'bg-orange-100 text-orange-800 ring-1 ring-orange-200',
  P2: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  P3: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
};

const statusStyles: Record<TaskStatus, string> = {
  'Not Started': 'bg-gray-100 text-gray-700',
  Next: 'bg-sky-100 text-sky-800',
  'In Progress': 'bg-indigo-100 text-indigo-800',
  Waiting: 'bg-amber-100 text-amber-800',
  Blocked: 'bg-rose-100 text-rose-800',
  Done: 'bg-emerald-100 text-emerald-800',
  Dropped: 'bg-zinc-100 text-zinc-500 line-through',
};

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((d.getTime() - today.setHours(0, 0, 0, 0)) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff <= 7) return `In ${diff}d`;
  if (diff < -1 && diff >= -30) return `${Math.abs(diff)}d overdue`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
}

function OwnerBadges({ owners }: { owners: NotionPerson[] }) {
  if (!owners.length) return <span className="text-xs text-gray-400">Unassigned</span>;
  return (
    <div className="flex -space-x-1.5">
      {owners.slice(0, 3).map((o) => (
        <span
          key={o.id}
          title={o.name}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-800 ring-2 ring-white"
        >
          {initials(o.name)}
        </span>
      ))}
      {owners.length > 3 ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 ring-2 ring-white">
          +{owners.length - 3}
        </span>
      ) : null}
    </div>
  );
}

export function TasksTab() {
  const [view, setView] = useState<View>('open');
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [meNotionId, setMeNotionId] = useState<string | null>(null);
  const [workspaceUsers, setWorkspaceUsers] = useState<NotionPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Draft-new-task form
  const [draft, setDraft] = useState<{
    title: string;
    area?: TaskArea;
    priority: TaskPriority;
    ownerIds: string[];
    dueDate: string;
    definitionOfDone: string;
  }>({ title: '', priority: 'P2', ownerIds: [], dueDate: '', definitionOfDone: '' });

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch('/api/notion/me', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setMeNotionId(data?.notionUser?.id ?? null);
      setWorkspaceUsers(data?.workspaceUsers ?? []);
    } catch {}
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (view === 'mine') {
        if (!meNotionId) {
          setTasks([]);
          setError(
            'Your login email isn\'t linked to a Notion user yet. Ask Naomi to add you as a Notion Guest, or use another filter.',
          );
          setLoading(false);
          return;
        }
        params.set('view', 'open');
        params.set('ownerId', meNotionId);
      } else {
        params.set('view', view);
      }
      const res = await fetch(`/api/notion/tasks?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setTasks(data.tasks ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [view, meNotionId]);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const grouped = useMemo(() => {
    const buckets: Record<TaskPriority | 'None', TaskRecord[]> = {
      P0: [],
      P1: [],
      P2: [],
      P3: [],
      None: [],
    };
    for (const t of tasks) buckets[t.priority ?? 'None'].push(t);
    return buckets;
  }, [tasks]);

  async function updateStatus(id: string, status: TaskStatus) {
    setSavingId(id);
    const prev = tasks;
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      const res = await fetch(`/api/notion/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(prev);
      setError('Could not update status. Try again.');
    } finally {
      setSavingId(null);
    }
  }

  async function signOff(id: string) {
    setSavingId(id);
    const prev = tasks;
    try {
      const res = await fetch(`/api/notion/tasks/${id}/sign-off`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'failed');
      setTasks((cur) => cur.map((t) => (t.id === id ? data.task : t)));
    } catch {
      setTasks(prev);
      setError('Could not sign off this task. Try again.');
    } finally {
      setSavingId(null);
    }
  }

  async function createTaskFromDraft() {
    if (!draft.title.trim()) return;
    try {
      const res = await fetch('/api/notion/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title.trim(),
          status: 'Next',
          priority: draft.priority,
          area: draft.area,
          ownerIds: draft.ownerIds.length ? draft.ownerIds : undefined,
          dueDate: draft.dueDate || undefined,
          definitionOfDone: draft.definitionOfDone || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setDraft({ title: '', priority: 'P2', ownerIds: [], dueDate: '', definitionOfDone: '' });
      setCreating(false);
      loadTasks();
    } catch {
      setError('Could not create task.');
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
          <p className="text-xs text-gray-500">
            Live from Notion — Sabi Command Center → Tasks. Finish something? Hit <span className="font-semibold text-emerald-700">Sign off ✓</span> to mark it done and put your name on it.
          </p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="rounded-md bg-[var(--primary-dark)] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[var(--primary-darker)]"
        >
          {creating ? 'Cancel' : '+ New task'}
        </button>
      </div>

      {/* View chips */}
      <div className="flex flex-wrap gap-2 pb-4">
        {(
          [
            { id: 'open', label: 'Open' },
            { id: 'mine', label: 'Assigned to me' },
            { id: 'all', label: 'All' },
            { id: 'done', label: 'Done' },
          ] as const
        ).map((chip) => (
          <button
            key={chip.id}
            onClick={() => setView(chip.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              view === chip.id
                ? 'bg-[var(--primary-dark)] text-white'
                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* New task form */}
      {creating ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="col-span-full text-xs font-semibold text-gray-700">
              Title
              <input
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="What needs to happen?"
              />
            </label>

            <label className="text-xs font-semibold text-gray-700">
              Area
              <select
                value={draft.area ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, area: (e.target.value || undefined) as TaskArea | undefined }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              >
                <option value="">— pick area —</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-gray-700">
              Priority
              <select
                value={draft.priority}
                onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as TaskPriority }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-semibold text-gray-700">
              Owner
              <select
                multiple
                value={draft.ownerIds}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    ownerIds: Array.from(e.target.selectedOptions).map((o) => o.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                size={Math.min(4, Math.max(2, workspaceUsers.length))}
              >
                {workspaceUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                    {u.email ? ` (${u.email})` : ''}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-[10px] font-normal text-gray-500">Cmd/Ctrl+click for multi</span>
            </label>

            <label className="text-xs font-semibold text-gray-700">
              Due date
              <input
                type="date"
                value={draft.dueDate}
                onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              />
            </label>

            <label className="col-span-full text-xs font-semibold text-gray-700">
              Definition of Done
              <textarea
                value={draft.definitionOfDone}
                onChange={(e) => setDraft((d) => ({ ...d, definitionOfDone: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                rows={2}
                placeholder="How will we know it's really done?"
              />
            </label>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setCreating(false)}
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={createTaskFromDraft}
              disabled={!draft.title.trim()}
              className="rounded-md bg-[var(--primary-dark)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--primary-darker)] disabled:opacity-40"
            >
              Create
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-500">Loading tasks from Notion…</p>
      ) : tasks.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No tasks in this view.</p>
      ) : (
        <div className="space-y-6">
          {(['P0', 'P1', 'P2', 'P3', 'None'] as const).map((bucket) => {
            const items = grouped[bucket];
            if (!items.length) return null;
            return (
              <div key={bucket}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  {bucket === 'None' ? 'Unprioritized' : bucket}
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {items.map((t) => {
                    const expanded = expandedId === t.id;
                    return (
                      <div key={t.id} className="border-b border-gray-100 last:border-b-0">
                        <div className="grid grid-cols-[24px_1fr_auto_auto_auto_auto] items-center gap-3 px-3 py-2.5 hover:bg-gray-50">
                          <button
                            onClick={() => setExpandedId(expanded ? null : t.id)}
                            className="text-gray-400 hover:text-gray-700"
                            aria-label={expanded ? 'Collapse' : 'Expand'}
                          >
                            {expanded ? '▾' : '▸'}
                          </button>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">{t.title || '(untitled)'}</p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              {t.area ? (
                                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700">
                                  {t.area}
                                </span>
                              ) : null}
                              {t.priority ? (
                                <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${priorityStyles[t.priority]}`}>
                                  {t.priority}
                                </span>
                              ) : null}
                              {t.dueDate ? (
                                <span
                                  className={`text-[11px] font-medium ${
                                    t.dueDate && new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
                                      ? 'text-rose-700'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {formatDate(t.dueDate)}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <OwnerBadges owners={t.owners} />

                          <select
                            value={t.status ?? 'Not Started'}
                            onChange={(e) => updateStatus(t.id, e.target.value as TaskStatus)}
                            disabled={savingId === t.id}
                            className={`rounded-md border-0 px-2 py-1 text-[11px] font-semibold ${
                              statusStyles[t.status ?? 'Not Started']
                            } focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          {t.status === 'Done' && t.signedOffBy ? (
                            <span
                              className="whitespace-nowrap rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800 ring-1 ring-emerald-200"
                              title={`Signed off${t.signedOffAt ? ` ${new Date(t.signedOffAt).toLocaleString()}` : ''}`}
                            >
                              ✍️ {t.signedOffBy}
                              {t.signedOffAt ? ` · ${formatDate(t.signedOffAt)}` : ''}
                            </span>
                          ) : (
                            <button
                              onClick={() => signOff(t.id)}
                              disabled={savingId === t.id}
                              className="whitespace-nowrap rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                              title="Mark done and sign your name to it"
                            >
                              {savingId === t.id ? 'Signing…' : 'Sign off ✓'}
                            </button>
                          )}

                          <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-emerald-700"
                            title="Open in Notion"
                          >
                            ↗
                          </a>
                        </div>

                        {expanded ? (
                          <div className="border-t border-gray-100 bg-gray-50 px-10 py-3 text-xs text-gray-700">
                            {t.definitionOfDone ? (
                              <p className="mb-2">
                                <span className="font-semibold text-gray-800">Definition of Done: </span>
                                {t.definitionOfDone}
                              </p>
                            ) : null}
                            {t.notes ? (
                              <p className="mb-2 whitespace-pre-wrap">
                                <span className="font-semibold text-gray-800">Notes: </span>
                                {t.notes}
                              </p>
                            ) : null}
                            {!t.definitionOfDone && !t.notes ? (
                              <p className="italic text-gray-400">No DoD or notes yet. Edit in Notion.</p>
                            ) : null}
                            {t.signedOffBy ? (
                              <p className="mb-2 font-medium text-emerald-700">
                                ✍️ Signed off by {t.signedOffBy}
                                {t.signedOffAt ? ` on ${new Date(t.signedOffAt).toLocaleString()}` : ''}
                              </p>
                            ) : null}
                            <p className="mt-2 text-[10px] uppercase tracking-widest text-gray-400">
                              Last edited {new Date(t.lastEditedTime).toLocaleString()}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
