'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { KnowledgeRelationship } from '@/lib/workspace/types';

export default function ReviewQueue() {
  const [rows, setRows] = useState<KnowledgeRelationship[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/workspace/knowledge/relationships?status=candidate');
    if (res.status === 503) {
      setError('Run supabase-sabi-knowledge.sql in the Supabase SQL editor.');
      return;
    }
    if (!res.ok) {
      setError('Could not load the review queue.');
      return;
    }
    setRows((await res.json()).relationships ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(id: string, action: 'accept' | 'reject') {
    setBusy(true);
    await fetch(`/api/workspace/knowledge/relationships/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    await load();
  }

  return (
    <div className="ws-body">
      <div className="ws-card">
        <h2>Verify candidate links</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          Inferred edges stay off Explore and Why pages until someone Accepts them. Rejected edges never appear in chains.
        </p>
        {error ? <p className="ws-error">{error}</p> : null}
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Rel</th>
              <th>To</th>
              <th>Confidence</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.from_item ? (
                    <Link className="ws-link" href={`/workspace/intelligence/items/${r.from_item.id}`}>
                      {r.from_item.code || r.from_item.title}
                    </Link>
                  ) : (
                    r.from_id
                  )}
                </td>
                <td>
                  <span className="ws-pill">{r.rel}</span>
                </td>
                <td>
                  {r.to_item ? (
                    <Link className="ws-link" href={`/workspace/intelligence/items/${r.to_item.id}`}>
                      {r.to_item.code || r.to_item.title}
                    </Link>
                  ) : (
                    r.to_id
                  )}
                </td>
                <td>{r.confidence}</td>
                <td>
                  <div className="ws-form-row">
                    <button className="primary" type="button" disabled={busy} onClick={() => void act(r.id, 'accept')}>
                      Accept
                    </button>
                    <button type="button" disabled={busy} onClick={() => void act(r.id, 'reject')}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !error ? <p className="ws-muted">Queue is empty. Only verified edges show in Why chains.</p> : null}
      </div>
    </div>
  );
}
