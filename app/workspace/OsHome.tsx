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

export default function OsHome() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [phoneUp, setPhoneUp] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [ex, cl] = await Promise.all([
      fetch('/api/workspace/knowledge/explore'),
      fetch('/api/workspace/classroom', { cache: 'no-store' }),
    ]);
    if (ex.status === 503) {
      setError('Run supabase-sabi-work.sql then supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (ex.ok) setChains(((await ex.json()).chains ?? []).slice(0, 4));
    if (cl.ok) setPhoneUp(Boolean((await cl.json()).phoneServerUp));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="ws-body">
      {error ? <p className="ws-error">{error}</p> : null}
      {phoneUp === false ? (
        <div className="ws-banner bad">Phone path is down. Product still shows learners from Supabase. Intelligence does not wait on Hetzner.</div>
      ) : null}
      <div className="ws-home-grid">
        <Link href="/workspace/product" className="ws-card">
          <p className="ws-kicker">Product</p>
          <h2>Classroom</h2>
          <p className="ws-muted">Learners, live calls, architecture. PIN stays on child records.</p>
        </Link>
        <Link href="/workspace/work" className="ws-card">
          <p className="ws-kicker">Work</p>
          <h2>Projects and tasks</h2>
          <p className="ws-muted">Labor generated from decisions — not a second Slack.</p>
        </Link>
        <Link href="/workspace/company" className="ws-card">
          <p className="ws-kicker">Company</p>
          <h2>People, partners, policies</h2>
          <p className="ws-muted">Who is on Sabi, who we talk to, what we must follow.</p>
        </Link>
        <Link href="/workspace/intelligence" className="ws-card">
          <p className="ws-kicker">Intelligence</p>
          <h2>Why Sabi is built this way</h2>
          <p className="ws-muted">Research, decisions, claims. The file is an artifact, not the knowledge.</p>
        </Link>
      </div>
      <div className="ws-card">
        <h2>How Sabi knows what it knows</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          Search Intelligence for questions like “why phone not app”. Verified edges only.
        </p>
        {chains.map((c) => (
          <div key={c.item.id} className="ws-chain">
            <div className="ws-chain-step">
              <span className="ws-pill">{c.item.code || c.item.type}</span>{' '}
              <Link className="ws-link" href={`/workspace/intelligence/items/${c.item.id}`}>
                {c.item.title}
              </Link>
              <div className="ws-muted">{c.item.why_it_matters}</div>
            </div>
            {c.evidence[0] ? (
              <div className="ws-chain-step">
                Evidence · {c.evidence[0].title}
              </div>
            ) : null}
            {c.implementations[0] ? (
              <div className="ws-chain-step">
                Implemented in · {c.implementations[0].implements_path || c.implementations[0].title}
              </div>
            ) : null}
            {c.projects[0] ? (
              <div className="ws-chain-step">
                Project · {c.projects[0].title}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
