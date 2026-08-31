'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { KnowledgeItem } from '@/lib/workspace/types';

export default function ItemLedger({
  type,
  title,
  blurb,
}: {
  type: string;
  title: string;
  blurb: string;
}) {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`/api/workspace/knowledge/items?type=${encodeURIComponent(type)}`);
    if (res.status === 503) {
      setError('Run supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (!res.ok) {
      setError('Could not load ledger.');
      return;
    }
    setItems((await res.json()).items ?? []);
  }, [type]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="ws-body">
      <div className="ws-card">
        <h2>{title}</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          {blurb}
        </p>
        {error ? <p className="ws-error">{error}</p> : null}
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Implemented in</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="ws-pill">{item.code || item.type}</span>
                </td>
                <td>
                  <Link className="ws-link" href={`/workspace/intelligence/items/${item.id}`}>
                    {item.title}
                  </Link>
                  {item.caution ? <div className="ws-muted">Caution: {item.caution}</div> : null}
                  {item.used_in ? <div className="ws-muted">Used in: {item.used_in}</div> : null}
                </td>
                <td>{item.status}</td>
                <td>{item.decision_date || '—'}</td>
                <td className="ws-muted">{item.implements_path || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && !error ? <p className="ws-muted">Nothing seeded yet.</p> : null}
      </div>
    </div>
  );
}
