'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { KnowledgeItem, WorkProject } from '@/lib/workspace/types';

type Chain = {
  item: KnowledgeItem;
  evidence: Array<KnowledgeItem | null>;
  implementations: Array<KnowledgeItem | null>;
  outcomes: Array<KnowledgeItem | null>;
  projects: Array<Pick<WorkProject, 'id' | 'title' | 'status'>>;
};

export default function IntelligenceExplore() {
  const [q, setQ] = useState('');
  const [chains, setChains] = useState<Chain[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (query: string) => {
    setBusy(true);
    setError('');
    const res = await fetch(`/api/workspace/knowledge/explore?q=${encodeURIComponent(query)}`);
    setBusy(false);
    if (res.status === 503) {
      setError('Run supabase-sabi-work.sql then supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (!res.ok) {
      setError('Could not search Intelligence.');
      return;
    }
    setChains((await res.json()).chains ?? []);
  }, []);

  useEffect(() => {
    void load('');
  }, [load]);

  return (
    <div className="ws-body">
      <div className="ws-card">
        <h2>How Sabi knows what it knows</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          Ask why. Results are chains (decision → evidence → implementation → project), not a file list.
        </p>
        <form
          className="ws-form"
          onSubmit={(e) => {
            e.preventDefault();
            void load(q);
          }}
        >
          <div className="ws-form-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Why does Sabi use phone calls instead of an app?"
              style={{ flex: 1, minWidth: 240 }}
            />
            <button className="primary" type="submit" disabled={busy}>
              Search
            </button>
          </div>
        </form>
        {error ? <p className="ws-error">{error}</p> : null}
        {chains.map((c) => (
          <div key={c.item.id} className="ws-chain">
            <div className="ws-chain-step">
              <span className="ws-pill">{c.item.type}</span> <span className="ws-pill">{c.item.status}</span>{' '}
              <Link className="ws-link" href={`/workspace/intelligence/items/${c.item.id}`}>
                {c.item.code ? `${c.item.code} · ` : ''}
                {c.item.title}
              </Link>
              <div className="ws-muted">{c.item.why_it_matters || c.item.summary}</div>
            </div>
            {c.evidence.filter(Boolean).map((ev) => (
              <div key={ev!.id} className="ws-chain-step">
                Evidence · {ev!.title}
              </div>
            ))}
            {c.implementations.filter(Boolean).map((im) => (
              <div key={im!.id} className="ws-chain-step">
                Implementation · {im!.implements_path || im!.title}
              </div>
            ))}
            {c.outcomes.filter(Boolean).map((ou) => (
              <div key={ou!.id} className="ws-chain-step">
                Outcome · {ou!.title} ({ou!.status})
              </div>
            ))}
            {c.projects.map((p) => (
              <div key={p.id} className="ws-chain-step">
                Project · <Link className="ws-link" href="/workspace/work/projects">{p.title}</Link>
              </div>
            ))}
          </div>
        ))}
        {chains.length === 0 && !error ? <p className="ws-muted">No verified chains for that question yet.</p> : null}
      </div>
    </div>
  );
}
