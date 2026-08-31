'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KnowledgeItem } from '@/lib/workspace/types';

const MILESTONES = [
  { date: '2026-02-01', label: 'Problem identified' },
  { date: '2026-03-01', label: 'Voice-first decision' },
  { date: '2026-04-01', label: 'Curriculum architecture (TaRL, market math)' },
  { date: '2026-05-01', label: 'First voice prototype / Asterisk path' },
  { date: '2026-06-01', label: 'Adaptive curriculum and STT research' },
  { date: '2026-07-01', label: 'STT provider experiments' },
  { date: '2026-07-23', label: 'Gemini STT live latency failure — DORMANT' },
  { date: '2026-08-01', label: 'Gemini Live production flag; Lagos pilot design' },
];

export default function HistoryTimeline() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/workspace/knowledge/items');
    if (res.status === 503) {
      setError('Run supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (!res.ok) {
      setError('Could not load history.');
      return;
    }
    setItems((await res.json()).items ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const byDate = useMemo(() => {
    const map = new Map<string, KnowledgeItem[]>();
    for (const item of items) {
      if (!item.decision_date) continue;
      const list = map.get(item.decision_date) || [];
      list.push(item);
      map.set(item.decision_date, list);
    }
    return map;
  }, [items]);

  const dates = useMemo(() => {
    const set = new Set([...MILESTONES.map((m) => m.date), ...[...byDate.keys()]]);
    return [...set].sort();
  }, [byDate]);

  return (
    <div className="ws-body">
      <div className="ws-card">
        <h2>Sabi history</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          Architectures are not collapsed to the latest. Whisper → VAD → hotwords → Intron lane → Gemini STT bake-off →
          Jul 23 rollback → Gemini Live. The rollback stays on this page.
        </p>
        {error ? <p className="ws-error">{error}</p> : null}
        <div className="ws-chain">
          {dates.map((date) => {
            const milestone = MILESTONES.find((m) => m.date === date);
            const rows = byDate.get(date) || [];
            return (
              <div key={date} className="ws-chain-step">
                <strong>{date}</strong>
                {milestone ? <div>{milestone.label}</div> : null}
                {rows.map((item) => (
                  <div key={item.id}>
                    <span className="ws-pill">{item.type}</span>{' '}
                    <span className="ws-pill">{item.status}</span>{' '}
                    <Link className="ws-link" href={`/workspace/intelligence/items/${item.id}`}>
                      {item.code ? `${item.code} · ` : ''}
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
