'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { KnowledgeItem, WorkProject, WorkTask } from '@/lib/workspace/types';
import { PROJECT_STATUSES } from '@/lib/workspace/types';

export default function ProjectsDesk() {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<WorkProject | null>(null);
  const [decisions, setDecisions] = useState<KnowledgeItem[]>([]);
  const [title, setTitle] = useState('');
  const [fromId, setFromId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [p, d] = await Promise.all([
      fetch('/api/workspace/projects'),
      fetch('/api/workspace/knowledge/items?type=insight'),
    ]);
    if (p.status === 503) {
      setError('Run supabase-sabi-work.sql then supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (p.ok) setProjects((await p.json()).projects ?? []);
    if (d.ok) setDecisions((await d.json()).items ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!openId) {
      setDetail(null);
      return;
    }
    void (async () => {
      const res = await fetch(`/api/workspace/projects/${openId}`);
      if (res.ok) setDetail((await res.json()).project);
    })();
  }, [openId]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/workspace/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, fromKnowledgeId: fromId || null }),
    });
    setTitle('');
    setBusy(false);
    await load();
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/workspace/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setBusy(false);
    await load();
    if (openId === id) {
      const res = await fetch(`/api/workspace/projects/${id}`);
      if (res.ok) setDetail((await res.json()).project);
    }
  }

  return (
    <div className="ws-body">
      <div className="ws-card">
        <h2>Projects</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          Work spawned from Intelligence. An insight can create a project with tasks.
        </p>
        {error ? <p className="ws-error">{error}</p> : null}
        <form className="ws-form" onSubmit={create}>
          <div className="ws-form-row">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
            <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
              <option value="">No linked insight</option>
              {decisions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code || item.type} · {item.title}
                </option>
              ))}
            </select>
            <button className="primary" type="submit" disabled={busy || !title.trim()}>
              Add project
            </button>
          </div>
        </form>
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>From</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} onClick={() => setOpenId(openId === project.id ? null : project.id)} style={{ cursor: 'pointer' }}>
                <td>
                  {project.title}
                  <div className="ws-muted">{project.summary}</div>
                  {openId === project.id && detail?.id === project.id ? (
                    <div style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
                      {(detail.tasks as WorkTask[] | undefined)?.map((t) => (
                        <div key={t.id}>
                          {t.title} · {t.status}
                        </div>
                      ))}
                      <Link className="ws-link" href="/workspace/work">
                        Open in My work
                      </Link>
                    </div>
                  ) : null}
                </td>
                <td>
                  <select
                    value={project.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => void patch(project.id, { status: e.target.value })}
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {project.linked_item ? (
                    <Link className="ws-link" href={`/workspace/intelligence/items/${project.linked_item.id}`} onClick={(e) => e.stopPropagation()}>
                      {project.linked_item.code || project.linked_item.title}
                    </Link>
                  ) : (
                    project.created_from
                  )}
                </td>
                <td>{project.due_date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && !error ? <p className="ws-muted">No projects yet.</p> : null}
      </div>
    </div>
  );
}
