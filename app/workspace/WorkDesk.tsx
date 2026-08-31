'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WorkDoc, WorkPerson, WorkTask, WorkUpdate } from '@/lib/workspace/types';
import { DOC_TYPES, SEATS, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/workspace/types';

type Tab = 'tasks' | 'docs' | 'team' | 'updates';

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WorkDesk() {
  const [tab, setTab] = useState<Tab>('tasks');
  const [people, setPeople] = useState<WorkPerson[]>([]);
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [docs, setDocs] = useState<WorkDoc[]>([]);
  const [updates, setUpdates] = useState<WorkUpdate[]>([]);
  const [view, setView] = useState<'open' | 'done' | 'all'>('open');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    const [p, t, d, u] = await Promise.all([
      fetch('/api/workspace/people'),
      fetch(`/api/workspace/tasks?view=${view}`),
      fetch('/api/workspace/docs'),
      fetch('/api/workspace/updates'),
    ]);
    if ([p, t, d, u].some((r) => r.status === 503)) {
      setError('Work tables are not on Supabase yet. Ask Naomi to run supabase/supabase-sabi-work.sql.');
      return;
    }
    if (![p, t, d, u].every((r) => r.ok)) {
      setError('Could not load work. Sign in with a worker account if this persists.');
      return;
    }
    setPeople((await p.json()).people ?? []);
    setTasks((await t.json()).tasks ?? []);
    setDocs((await d.json()).docs ?? []);
    setUpdates((await u.json()).updates ?? []);
  }, [view]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="ws-body">
      <div className="ws-tabs">
        {([
          ['tasks', 'Tasks'],
          ['docs', 'Docs'],
          ['team', 'Team'],
          ['updates', 'Updates'],
        ] as const).map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {error ? <p className="ws-error">{error}</p> : null}
      {tab === 'tasks' ? (
        <TasksPanel
          tasks={tasks}
          people={people}
          docs={docs}
          view={view}
          setView={setView}
          busy={busy}
          setBusy={setBusy}
          onSaved={load}
        />
      ) : null}
      {tab === 'docs' ? <DocsPanel docs={docs} busy={busy} setBusy={setBusy} onSaved={load} /> : null}
      {tab === 'team' ? <TeamPanel people={people} busy={busy} setBusy={setBusy} onSaved={load} /> : null}
      {tab === 'updates' ? (
        <UpdatesPanel updates={updates} tasks={tasks} busy={busy} setBusy={setBusy} onSaved={load} />
      ) : null}
    </div>
  );
}

function TasksPanel({
  tasks,
  people,
  docs,
  view,
  setView,
  busy,
  setBusy,
  onSaved,
}: {
  tasks: WorkTask[];
  people: WorkPerson[];
  docs: WorkDoc[];
  view: 'open' | 'done' | 'all';
  setView: (v: 'open' | 'done' | 'all') => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('P2');
  const [openId, setOpenId] = useState<string | null>(null);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/workspace/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, assigneeId: assigneeId || null, dueDate: dueDate || null, priority }),
    });
    setTitle('');
    setBusy(false);
    await onSaved();
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/workspace/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setBusy(false);
    await onSaved();
  }

  return (
    <div className="ws-card">
      <h2>Assign work</h2>
      <form className="ws-form" onSubmit={createTask}>
        <div className="ws-form-row">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
          <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button className="primary" type="submit" disabled={busy || !title.trim()}>
            Add task
          </button>
        </div>
      </form>
      <div className="ws-form-row" style={{ marginBottom: 12 }}>
        {(['open', 'done', 'all'] as const).map((v) => (
          <button key={v} type="button" className={view === v ? 'active' : ''} onClick={() => setView(v)}>
            {v === 'open' ? 'Open' : v === 'done' ? 'Done' : 'All'}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Who</th>
            <th>Due</th>
            <th>Status</th>
            <th>Pri</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} onClick={() => setOpenId(openId === task.id ? null : task.id)} style={{ cursor: 'pointer' }}>
              <td>
                {task.title}
                {openId === task.id ? (
                  <div style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
                    <textarea
                      defaultValue={task.notes}
                      rows={3}
                      style={{ width: '100%' }}
                      onBlur={(e) => {
                        if (e.target.value !== task.notes) void patch(task.id, { notes: e.target.value });
                      }}
                    />
                    <div className="ws-form-row" style={{ marginTop: 8 }}>
                      <select
                        defaultValue={task.linked_doc_id || ''}
                        onChange={(e) => void patch(task.id, { linkedDocId: e.target.value || null })}
                      >
                        <option value="">No linked doc</option>
                        {docs.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.title}
                          </option>
                        ))}
                      </select>
                      {task.status !== 'Done' ? (
                        <button type="button" className="primary" onClick={() => void patch(task.id, { status: 'Done', signOff: true })}>
                          Mark done
                        </button>
                      ) : (
                        <span className="ws-muted">
                          Signed off {task.signed_off_by ? `by ${task.signed_off_by}` : ''} {fmtDate(task.signed_off_at)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}
              </td>
              <td>
                <select
                  value={task.assignee_id || ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => void patch(task.id, { assigneeId: e.target.value || null })}
                >
                  <option value="">Unassigned</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="date"
                  value={task.due_date || ''}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => void patch(task.id, { dueDate: e.target.value || null })}
                />
              </td>
              <td>
                <select
                  value={task.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => void patch(task.id, { status: e.target.value, signOff: e.target.value === 'Done' })}
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td>
                <span className="ws-pill">{task.priority}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tasks.length === 0 ? <p className="ws-muted">No tasks in this view.</p> : null}
    </div>
  );
}

function DocsPanel({
  docs,
  busy,
  setBusy,
  onSaved,
}: {
  docs: WorkDoc[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Other');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    const form = new FormData();
    form.set('file', file);
    form.set('title', title);
    form.set('docType', docType);
    form.set('notes', notes);
    await fetch('/api/workspace/docs', { method: 'POST', body: form });
    setTitle('');
    setNotes('');
    setFile(null);
    setBusy(false);
    await onSaved();
  }

  return (
    <div className="ws-card">
      <h2>Document cabinet</h2>
      <p className="ws-muted">PDFs, decks, SOPs — stored in Sabi, not Notion. 25 MB max.</p>
      <form className="ws-form" onSubmit={upload}>
        <div className="ws-form-row">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <select value={docType} onChange={(e) => setDocType(e.target.value)}>
            {DOC_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="primary" type="submit" disabled={busy || !file}>
            Upload
          </button>
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={2} />
      </form>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>By</th>
            <th>When</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id}>
              <td>
                {doc.title}
                {doc.notes ? <div className="ws-muted">{doc.notes}</div> : null}
              </td>
              <td>
                <span className="ws-pill">{doc.doc_type}</span>
              </td>
              <td>{doc.uploaded_by || '—'}</td>
              <td>{fmtDate(doc.created_at)}</td>
              <td>
                <a href={`/api/workspace/docs/${doc.id}/file`}>Download</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {docs.length === 0 ? <p className="ws-muted">Nothing in the cabinet yet.</p> : null}
    </div>
  );
}

function TeamPanel({
  people,
  busy,
  setBusy,
  onSaved,
}: {
  people: WorkPerson[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [seat, setSeat] = useState('Ops');

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/workspace/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, seat }),
    });
    setName('');
    setEmail('');
    setBusy(false);
    await onSaved();
  }

  const bySeat = useMemo(() => {
    const map = new Map<string, WorkPerson[]>();
    for (const p of people) {
      const list = map.get(p.seat) || [];
      list.push(p);
      map.set(p.seat, list);
    }
    return [...map.entries()];
  }, [people]);

  return (
    <div className="ws-card">
      <h2>Team</h2>
      <form className="ws-form" onSubmit={add}>
        <div className="ws-form-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" />
          <select value={seat} onChange={(e) => setSeat(e.target.value)}>
            {SEATS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="primary" type="submit" disabled={busy || !name.trim()}>
            Add person
          </button>
        </div>
      </form>
      {bySeat.map(([seatName, rows]) => (
        <div key={seatName} style={{ marginBottom: 16 }}>
          <h3>{seatName}</h3>
          <table>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="ws-muted">{p.email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function UpdatesPanel({
  updates,
  tasks,
  busy,
  setBusy,
  onSaved,
}: {
  updates: WorkUpdate[];
  tasks: WorkTask[];
  busy: boolean;
  setBusy: (v: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const [body, setBody] = useState('');
  const [taskId, setTaskId] = useState('');

  async function post(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/workspace/updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, taskId: taskId || null }),
    });
    setBody('');
    setBusy(false);
    await onSaved();
  }

  return (
    <div className="ws-card">
      <h2>Status updates</h2>
      <p className="ws-muted">What Sonia, Remi, or you are working on — a feed, not Slack.</p>
      <form className="ws-form" onSubmit={post}>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What happened?" rows={3} required />
        <div className="ws-form-row">
          <select value={taskId} onChange={(e) => setTaskId(e.target.value)}>
            <option value="">No linked task</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <button className="primary" type="submit" disabled={busy || !body.trim()}>
            Post update
          </button>
        </div>
      </form>
      {updates.map((u) => (
        <div key={u.id} style={{ borderTop: '1px solid var(--line)', padding: '12px 0' }}>
          <div className="ws-muted">
            {u.author} · {new Date(u.created_at).toLocaleString()}
          </div>
          <div>{u.body}</div>
        </div>
      ))}
      {updates.length === 0 ? <p className="ws-muted">No updates yet.</p> : null}
    </div>
  );
}
