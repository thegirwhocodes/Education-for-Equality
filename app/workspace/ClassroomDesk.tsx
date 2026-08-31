'use client';

import { useCallback, useEffect, useState } from 'react';

type Learner = {
  id: string;
  name: string | null;
  phone_number: string | null;
  total_correct: number | null;
  total_wrong: number | null;
  updated_at: string | null;
};

type ClassroomPayload = {
  phoneServerUp: boolean;
  adminUrl: string;
  learners: Learner[];
};

export default function ClassroomDesk() {
  const [data, setData] = useState<ClassroomPayload | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    const res = await fetch('/api/workspace/classroom', { cache: 'no-store' });
    if (!res.ok) {
      setError('Could not load classroom snapshot.');
      return;
    }
    setData(await res.json());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="ws-body">
      {data && !data.phoneServerUp ? (
        <div className="ws-banner bad">
          Phone path is down. Learners cannot place calls until the Asterisk box is back or rebuilt on another VPS
          and Africa&apos;s Talking is re-pointed. Classroom work (this page, learner records) lives here and does not
          wait on that server.
        </div>
      ) : null}
      {data?.phoneServerUp ? (
        <div className="ws-banner ok">
          Phone server is answering. Open the live review console for calls, STT, and lesson traces.
        </div>
      ) : null}

      <div className="ws-card" style={{ marginBottom: 18 }}>
        <h2>Live admin console</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          Same gold-ink review desk as before: learners, calls, curriculum. It still runs on the phone box, so it is
          only reachable when that server is up. PIN stays on — it protects children&apos;s records.
        </p>
        <a href="https://api.eduforequality.org/admin/review" target="_blank" rel="noreferrer">
          <button className="primary" type="button">
            Open live console
          </button>
        </a>
      </div>

      <div className="ws-card">
        <h2>Learners</h2>
        <p className="ws-muted" style={{ margin: '8px 0 14px' }}>
          Snapshot from Supabase, independent of the phone box.
        </p>
        {error ? <p className="ws-error">{error}</p> : null}
        {!data ? <p className="ws-muted">Loading…</p> : null}
        {data && data.learners.length === 0 ? <p className="ws-muted">No learner rows yet.</p> : null}
        {data && data.learners.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.learners.map((row) => (
                <tr key={row.id}>
                  <td>{row.name || '—'}</td>
                  <td>{row.phone_number || '—'}</td>
                  <td>{row.total_correct ?? 0}</td>
                  <td>{row.total_wrong ?? 0}</td>
                  <td>{row.updated_at ? new Date(row.updated_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
