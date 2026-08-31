'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { KnowledgeArtifact, KnowledgeItem, KnowledgeRelationship, WorkProject } from '@/lib/workspace/types';

type Payload = {
  item: KnowledgeItem;
  outbound: Array<KnowledgeRelationship & { to_item?: KnowledgeItem | null }>;
  inbound: Array<KnowledgeRelationship & { from_item?: KnowledgeItem | null }>;
  projects: WorkProject[];
  artifacts: KnowledgeArtifact[];
};

function live<T extends { status: string }>(rows: T[]) {
  return rows.filter((r) => r.status === 'verified');
}

export default function ItemWhy({ id }: { id: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`/api/workspace/knowledge/items/${id}`);
    if (res.status === 503) {
      setError('Run supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (!res.ok) {
      setError('Could not load this item.');
      return;
    }
    setData(await res.json());
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function spawnProject() {
    if (!data) return;
    setBusy(true);
    setMsg('');
    const res = await fetch('/api/workspace/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromKnowledgeId: data.item.id }),
    });
    setBusy(false);
    if (!res.ok) {
      setMsg('Could not create project. Apply the SQL first.');
      return;
    }
    const { project } = await res.json();
    setMsg(`Created project “${project.title}”.`);
    await load();
  }

  if (error) {
    return (
      <div className="ws-body">
        <p className="ws-error">{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="ws-body">
        <p className="ws-muted">Loading…</p>
      </div>
    );
  }
  const item = data.item;
  const out = live(data.outbound);
  const inn = live(data.inbound);
  return (
    <div className="ws-body">
      <p className="ws-muted">
        <Link className="ws-link" href="/workspace/intelligence">
          Intelligence
        </Link>
      </p>
      <div className="ws-card" style={{ marginTop: 12 }}>
        <p className="ws-kicker">{item.type}</p>
        <h2>
          {item.code ? `${item.code} · ` : ''}
          {item.title}
        </h2>
        <div className="ws-form-row" style={{ marginTop: 10 }}>
          <span className="ws-pill">{item.status}</span>
          <span className="ws-pill">{item.confidence}</span>
          {item.domain ? <span className="ws-pill">{item.domain}</span> : null}
        </div>
        <p style={{ marginTop: 14 }}>{item.summary}</p>
        <h3 style={{ marginTop: 18 }}>Why this exists</h3>
        <p>{item.why_it_matters}</p>
        {item.caution ? (
          <div className="ws-banner" style={{ marginTop: 14 }}>
            Caution: {item.caution}
          </div>
        ) : null}
        <dl className="ws-muted" style={{ marginTop: 16 }}>
          <div>Date · {item.decision_date || '—'}</div>
          <div>Decision maker · {item.decision_maker || '—'}</div>
          <div>Session · {item.origin_session_id || '—'}</div>
          <div>Commit · {item.origin_commit_sha || '—'}</div>
          <div>Implemented in · {item.implements_path || '—'}</div>
          <div>Product area · {item.product_area || '—'}</div>
          {item.used_in ? <div>Used in · {item.used_in}</div> : null}
        </dl>
        <div className="ws-form-row" style={{ marginTop: 16 }}>
          <button className="primary" type="button" disabled={busy} onClick={() => void spawnProject()}>
            Create project from this
          </button>
          {msg ? <span className="ws-muted">{msg}</span> : null}
        </div>
      </div>

      <div className="ws-two" style={{ marginTop: 16 }}>
        <div className="ws-card">
          <h3>Supported by / led to</h3>
          {out.map((r) => (
            <p key={r.id}>
              <span className="ws-pill">{r.rel}</span>{' '}
              {r.to_item ? (
                <Link className="ws-link" href={`/workspace/intelligence/items/${r.to_item.id}`}>
                  {r.to_item.code || r.to_item.type} · {r.to_item.title}
                </Link>
              ) : (
                r.to_id
              )}
            </p>
          ))}
          {inn.map((r) => (
            <p key={r.id}>
              <span className="ws-pill">{r.rel}</span> from{' '}
              {r.from_item ? (
                <Link className="ws-link" href={`/workspace/intelligence/items/${r.from_item.id}`}>
                  {r.from_item.code || r.from_item.type} · {r.from_item.title}
                </Link>
              ) : (
                r.from_id
              )}
            </p>
          ))}
          {out.length + inn.length === 0 ? <p className="ws-muted">No verified edges yet.</p> : null}
        </div>
        <div>
          <div className="ws-card" style={{ marginBottom: 12 }}>
            <h3>Projects</h3>
            {data.projects.map((p) => (
              <p key={p.id}>
                <Link className="ws-link" href="/workspace/work/projects">
                  {p.title}
                </Link>{' '}
                <span className="ws-muted">({p.status})</span>
              </p>
            ))}
            {data.projects.length === 0 ? <p className="ws-muted">No project linked. Create one from this item.</p> : null}
          </div>
          <div className="ws-card">
            <h3>Artifacts</h3>
            {data.artifacts.slice(0, 8).map((a) => (
              <p key={a.id}>
                {a.title}
                <div className="ws-muted">{a.path}</div>
              </p>
            ))}
            {data.artifacts.length === 0 ? <p className="ws-muted">No artifact rows for this domain yet.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
